import { IconButton } from '@mui/material';
import clsx from 'clsx';
import React, { useState } from 'react';
import { AppearanceSidebarState } from '../../../../../interfaces/user';
import { HistoriesPanel } from '../../../../components/HistoriesPanel';
import { Bookmarks, ChevronLeft, ChevronRight, Downloads, Histories } from '../../../../components/Icons';
import { useUserConfigContext } from '../../../../contexts/config';
import { useElectronAPI } from '../../../../utils/electron';
import { SidebarBookmarks, SidebarDownloads } from '../SidebarContent';
import { VerticalTabContainer } from '../TabContainer';
import { StyledSidebar, StyledToolBarContainer } from './styles';

export const Sidebar = () => {
    const { toggleSidebar } = useElectronAPI();

    const { config, setConfig } = useUserConfigContext();
    const { style, sidebar: { extended, state } } = config.appearance;

    const [panel, setPanel] = useState<AppearanceSidebarState>(state);

    const handleTogglePanelClick = (state: AppearanceSidebarState) => {
        const prevState = panel;
        const newState = prevState !== state ? state : 'tab_container';
        setPanel(newState);
        setConfig({ appearance: { sidebar: { state: newState } } });
        if (!extended && prevState === 'tab_container')
            toggleSidebar();
    };

    const handleToggleSidebarClick = () => {
        toggleSidebar();
        if (extended) {
            setPanel('tab_container');
            setConfig({ appearance: { sidebar: { state: 'tab_container' } } });
        }
    };

    return (
        <StyledSidebar className={clsx('sidebar', style === 'left' ? 'left' : 'right')} appearanceStyle={style}
                       extended={extended} panel={panel}>
            <VerticalTabContainer extended={extended && panel === 'tab_container'} />
            {panel === 'bookmarks' && <SidebarBookmarks />}
            {panel === 'histories' && <HistoriesPanel type="sidebar" />}
            {panel === 'downloads' && <SidebarDownloads />}
            <StyledToolBarContainer className="tool-bar" extended={extended} panel={panel}>
                <IconButton onClick={() => handleTogglePanelClick('bookmarks')}>
                    <Bookmarks />
                </IconButton>
                <IconButton onClick={() => handleTogglePanelClick('histories')}>
                    <Histories />
                </IconButton>
                <IconButton onClick={() => handleTogglePanelClick('downloads')}>
                    <Downloads />
                </IconButton>
                <IconButton
                    onClick={handleToggleSidebarClick}
                    sx={{
                        order: style === 'right' && extended && panel === 'tab_container' ? -1 : 0,
                        ml: style === 'left' && extended && panel === 'tab_container' ? 'auto' : 0,
                        mr: style === 'right' && extended && panel === 'tab_container' ? 'auto' : 0
                    }}>
                    {style === 'left' && (extended ? <ChevronLeft /> : <ChevronRight />)}
                    {style === 'right' && (extended ? <ChevronRight /> : <ChevronLeft />)}
                </IconButton>
            </StyledToolBarContainer>
        </StyledSidebar>
    );
};
