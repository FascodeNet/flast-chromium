import React, { MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from 'react';
import { MoveDirection } from '../../../../../interfaces/view';
import { useUserConfigContext } from '../../../../contexts/config';
import { useViewManagerContext } from '../../../../contexts/view';
import { useElectronAPI } from '../../../../utils/electron';
import { setTabsBounds } from '../../../../utils/tab';
import { AddTabButton } from '../AddTabButton';
import { HorizontalTab, VerticalTab } from '../Tab';
import { StyledHorizontalTabContainer, StyledVerticalTabContainer } from './styles';

export const HorizontalTabContainer = () => {
    const { views, setTabContainerWidth } = useViewManagerContext();
    const { moveToDirection } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleMouseWheel = (e: WheelEvent) => {
        if (e.deltaX === 0) {
            e.stopPropagation();
            e.preventDefault();

            tabContainerRef.current?.scrollBy(e.deltaY, 0);
        }
    };

    const handleResize = () => {
        const containerWidth = tabContainerRef.current?.offsetWidth ?? 0;
        if (containerWidth < 1) return;
        setTabContainerWidth(containerWidth);
        setTabsBounds(containerWidth, views, false);
    };


    const tabContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        tabContainerRef.current?.addEventListener('wheel', handleMouseWheel, { passive: false });

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            tabContainerRef.current?.removeEventListener('wheel', handleMouseWheel);
        };
    });

    const containerWidth = tabContainerRef.current?.offsetWidth ?? 0;
    useEffect(() => {
        if (containerWidth < 1) return;
        console.log('useEffect#TabContainerWidth', containerWidth);
        setTabContainerWidth(containerWidth);
        setTabsBounds(containerWidth, views, false);
    }, [containerWidth]);


    const [move, setMove] = useState<number | undefined>(undefined);
    const [moveDirection, setMoveDirection] = useState<MoveDirection | undefined>(undefined);
    const [selectedViewId, setSelectedViewId] = useState<number | undefined>();
    const [hoveredViewId, setHoveredViewId] = useState<number | undefined>();

    const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>, id: number) => {
        if (e.button !== 0 || selectedViewId) return;

        setSelectedViewId(id);
        setMove(e.pageX);
    };

    const handleMouseUp = () => {
        if (!selectedViewId) return;

        setMove(undefined);
        setMoveDirection(undefined);
        setSelectedViewId(undefined);
        setHoveredViewId(undefined);
    };

    const handleMouseEnter = (e: ReactMouseEvent<HTMLDivElement>, id: number) => {
        if (!move || !selectedViewId || hoveredViewId || !moveDirection) return;

        moveToDirection(selectedViewId, moveDirection);
        setHoveredViewId(id);
    };

    const handleMouseLeave = () => {
        if (!selectedViewId) return;

        setHoveredViewId(undefined);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!move || !selectedViewId) return;

        const abs = Math.abs(e.pageX - move);
        if (abs < 10) return;

        setMoveDirection(e.pageX < move ? 'start' : 'end');
        setMove(e.pageX);
    };

    return (
        <StyledHorizontalTabContainer className="horizontal-tab-container" ref={tabContainerRef}
                                      appearanceStyle={style}>
            {views.map((view) => {
                return (
                    <HorizontalTab
                        key={view.id}
                        state={view}
                        isDragging={view.id === selectedViewId}
                        onMouseDown={handleMouseDown}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                );
            })}
            <AddTabButton />
        </StyledHorizontalTabContainer>
    );
};

interface VerticalTabContainerProps {
    extended: boolean;
}

export const VerticalTabContainer = ({ extended }: VerticalTabContainerProps) => {
    const { moveToDirection } = useElectronAPI();

    const { views } = useViewManagerContext();

    const tabContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    });


    const [move, setMove] = useState<number | undefined>(undefined);
    const [moveDirection, setMoveDirection] = useState<MoveDirection | undefined>(undefined);
    const [selectedViewId, setSelectedViewId] = useState<number | undefined>();
    const [hoveredViewId, setHoveredViewId] = useState<number | undefined>();

    const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>, id: number) => {
        if (e.button !== 0 || selectedViewId) return;

        setSelectedViewId(id);
        setMove(e.pageX);
    };

    const handleMouseUp = () => {
        if (!selectedViewId) return;

        setMove(undefined);
        setMoveDirection(undefined);
        setSelectedViewId(undefined);
        setHoveredViewId(undefined);
    };

    const handleMouseEnter = (e: ReactMouseEvent<HTMLDivElement>, id: number) => {
        if (!move || !selectedViewId || hoveredViewId || !moveDirection) return;

        moveToDirection(selectedViewId, moveDirection);
        setHoveredViewId(id);
    };

    const handleMouseLeave = () => {
        if (!selectedViewId) return;

        setHoveredViewId(undefined);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!move || !selectedViewId) return;

        const abs = Math.abs(e.pageY - move);
        if (abs < 10) return;

        setMoveDirection(e.pageY < move ? 'start' : 'end');
        setMove(e.pageY);
    };

    return (
        <StyledVerticalTabContainer className="vertical-tab-container" ref={tabContainerRef}>
            {views.map((view) => {
                return (
                    <VerticalTab
                        key={view.id}
                        state={view}
                        isDragging={view.id === selectedViewId}
                        onMouseDown={handleMouseDown}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        extended={extended}
                    />
                );
            })}
            <AddTabButton />
        </StyledVerticalTabContainer>
    );
};
