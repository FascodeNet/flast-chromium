import { Divider } from '@mui/material';
import { platform } from 'os';
import React, { useEffect, useState } from 'react';
import { WindowsControls } from 'react-windows-controls';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useElectronAPI } from '../../../../../utils/electron';
import { ActionBar } from '../ActionBar';
import { AddressBar } from '../AddressBar';
import { ApplicationMenuButton } from '../ApplicationMenuButton';
import { NavigationBar } from '../NavigationBar';
import { HorizontalTabContainer } from '../TabContainer';
import { StyledContainer, StyledTitleBar, StyledWindowControls, StyledWrapper } from './styles';

export const TitleBar = () => {
    const { isMaximized, isFullScreen, minimize, maximize, close } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const [maximized, setMaximized] = useState(false);
    const [fullScreened, setFullScreened] = useState(false);

    const requestMaximized = () => {
        isMaximized().then((result) => setMaximized(result));
        isFullScreen().then((result) => setFullScreened(result));
    };

    useEffect(() => {
        window.addEventListener('resize', requestMaximized);

        return () => {
            window.removeEventListener('resize', requestMaximized);
        };
    }, []);

    const isMac = platform() === 'darwin';

    const TitleBarContent = () => {
        switch (style) {
            case 'top_single':
                return (
                    <StyledContainer className="title-bar-content" appearanceStyle={style}>
                        <NavigationBar />
                        <StyledWrapper>
                            <AddressBar />
                            <Divider flexItem orientation="vertical" variant="middle" sx={{ gridArea: 'divider' }} />
                            <HorizontalTabContainer />
                        </StyledWrapper>
                        <ActionBar />
                    </StyledContainer>
                );
            case 'top_double':
                return (
                    <StyledContainer className="title-bar-content" appearanceStyle={style}>
                        <HorizontalTabContainer />
                    </StyledContainer>
                );
            case 'bottom_single':
            case 'bottom_double':
            case 'left':
            case 'right':
                return (
                    <StyledContainer className="title-bar-content" appearanceStyle={style}>
                        {!isMac && <ApplicationMenuButton />}
                        <NavigationBar />
                        <AddressBar />
                        <browser-action-list />
                        <ActionBar />
                    </StyledContainer>
                );
        }
    };

    return (
        <StyledTitleBar className="title-bar" appearanceStyle={style} fullScreen={fullScreened}>
            <TitleBarContent />
            {!isMac &&
                <StyledWindowControls className="window-controllers">
                    <WindowsControls
                        isMaximized={maximized}
                        onMinimize={() => minimize()}
                        onMaximize={() => maximize()}
                        onClose={() => close()}
                    />
                </StyledWindowControls>
            }
        </StyledTitleBar>
    );
};
