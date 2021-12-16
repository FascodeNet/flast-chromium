import { IconButton } from '@mui/material';
import React, { MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from 'react';
import { MoveDirection } from '../../../../../interfaces/view';
import { Bookmarks, ChevronLeft, ChevronRight, Downloads, History } from '../../../../components/Icons';
import { useUserConfigContext } from '../../../../contexts/config';
import { useViewManagerContext } from '../../../../contexts/view';
import { useElectronAPI } from '../../../../utils/electron';
import { setTabsBounds } from '../../../../utils/tab';
import { AddTabButton } from '../AddTabButton';
import { HorizontalTab, VerticalTab } from '../Tab';
import {
    StyledHorizontalTabBar,
    StyledVerticalTabBar,
    StyledVerticalTabBarToolContainer,
    StyledVerticalTabContainer
} from './styles';

export const HorizontalTabBar = () => {
    const { views, setTabContainerWidth } = useViewManagerContext();
    const { moveToDirection } = useElectronAPI();

    const handleMouseWheel = (e: WheelEvent) => {
        if (e.deltaX === 0) {
            e.stopPropagation();
            e.preventDefault();

            tabContainerRef.current?.scrollBy(e.deltaY, 0);
        }
    };

    const handleResize = () => {
        const containerWidth = tabContainerRef.current?.offsetWidth ?? 0;
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
        setTabContainerWidth(containerWidth);
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
        <StyledHorizontalTabBar className="horizontal-tab-container" ref={tabContainerRef}>
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
        </StyledHorizontalTabBar>
    );
};

export const VerticalTabBar = () => {
    const { toggleSidebar, moveToDirection } = useElectronAPI();

    const { config } = useUserConfigContext();
    const { views } = useViewManagerContext();

    const handleToggleSidebarClick = () => toggleSidebar();

    const handleMouseWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) {
            e.stopPropagation();
            e.preventDefault();

            tabContainerRef.current?.scrollBy(0, e.deltaX);
        }
    };

    const tabContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        tabContainerRef.current?.addEventListener('wheel', handleMouseWheel, { passive: false });

        return () => {
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

    const { style, extended_sidebar } = config.appearance;
    return (
        <StyledVerticalTabBar className="vertical-tab-container" ref={tabContainerRef}>
            <StyledVerticalTabContainer>
                {views.map((view) => {
                    return (
                        <VerticalTab
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
            </StyledVerticalTabContainer>
            <StyledVerticalTabBarToolContainer extendedSidebar={extended_sidebar}>
                <IconButton>
                    <Bookmarks />
                </IconButton>
                <IconButton>
                    <History />
                </IconButton>
                <IconButton>
                    <Downloads />
                </IconButton>
                <IconButton
                    onClick={handleToggleSidebarClick}
                    sx={{
                        order: style === 'right' && extended_sidebar ? -1 : 0,
                        ml: style === 'left' && extended_sidebar ? 'auto' : 0,
                        mr: style === 'right' && extended_sidebar ? 'auto' : 0
                    }}>
                    {style === 'left' && (extended_sidebar ? <ChevronLeft /> : <ChevronRight />)}
                    {style === 'right' && (extended_sidebar ? <ChevronRight /> : <ChevronLeft />)}
                </IconButton>
            </StyledVerticalTabBarToolContainer>
        </StyledVerticalTabBar>
    );
};
