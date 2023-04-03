import { getCurrentWindow } from '@electron/remote';
import { ipcRenderer } from 'electron';
import React, { MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { MoveDirection } from '../../../../../../interfaces/view';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
import { setTabsBounds } from '../../../../../utils/tab';
import { HorizontalAddTabButton, VerticalAddTabButton } from '../AddTabButton';
import { HorizontalTab, VerticalTab } from '../Tab';
import { StyledHorizontalTabContainer, StyledHorizontalTabWrapper, StyledVerticalTabContainer } from './styles';

export const HorizontalTabContainer = () => {
    const { views, setTabContainerWidth } = useViewManagerContext();
    const { viewsApi } = useElectronAPI();

    const tabContainerRef = useRef<HTMLDivElement>();

    const ref = useCallback((element: HTMLDivElement | null) => {
        if (element) {
            tabContainerRef.current = element;

            const tabContainerWidth = element.offsetWidth ?? 0;
            if (tabContainerWidth < 1) return;

            console.log('ipcRenderer#TabContainerWidth', tabContainerWidth);
            setTabContainerWidth(tabContainerWidth);
            setTabsBounds(tabContainerWidth, views, false);
        }
    }, []);

    const handleMouseWheel = (e: WheelEvent) => {
        if (e.deltaX === 0) {
            e.stopPropagation();
            e.preventDefault();

            tabContainerRef.current?.scrollBy(e.deltaY, 0);
        }
    };

    const windowId = getCurrentWindow().id;
    useEffect(() => {
        ipcRenderer.on(`window-resize-${windowId}`, (e) => {
            const tabContainerWidth = tabContainerRef.current?.offsetWidth ?? 0;
            if (tabContainerWidth < 1) return;

            console.log('ipcRenderer#TabContainerWidth', tabContainerWidth);
            setTabContainerWidth(tabContainerWidth);
            setTabsBounds(tabContainerWidth, views, false);
        });

        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        tabContainerRef.current?.addEventListener('wheel', handleMouseWheel, { passive: false });

        return () => {
            ipcRenderer.removeAllListeners(`window-resize-${windowId}`);

            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            tabContainerRef.current?.removeEventListener('wheel', handleMouseWheel);
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

        viewsApi.moveToDirection(selectedViewId, moveDirection);
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
        <StyledHorizontalTabContainer className="horizontal-tab-container">
            <StyledHorizontalTabWrapper ref={ref} className="horizontal-tab-wrapper">
                {views.map((view) => (
                    <HorizontalTab
                        key={view.id}
                        state={view}
                        isDragging={view.id === selectedViewId}
                        onMouseDown={handleMouseDown}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}
            </StyledHorizontalTabWrapper>
            <HorizontalAddTabButton />
        </StyledHorizontalTabContainer>
    );
};

interface VerticalTabContainerProps {
    extended: boolean;
}

export const VerticalTabContainer = ({ extended }: VerticalTabContainerProps) => {
    const { viewsApi } = useElectronAPI();

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

        viewsApi.moveToDirection(selectedViewId, moveDirection);
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
        <StyledVerticalTabContainer ref={tabContainerRef} className="vertical-tab-container">
            {views.map((view) => (
                <VerticalTab
                    key={view.id}
                    state={view}
                    isDragging={view.id === selectedViewId}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    extended={extended}
                />
            ))}
            <VerticalAddTabButton />
        </StyledVerticalTabContainer>
    );
};
