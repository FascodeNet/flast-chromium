import { Divider, useTheme } from '@mui/material';
import { platform } from 'os';
import React, { useEffect, useState } from 'react';
import { WindowsControls } from 'react-windows-controls';
import { AppearanceStyle } from '../../../../../interfaces/user';
import { useUserConfigContext } from '../../../../contexts/config';
import { useElectronAPI } from '../../../../utils/electron';
import { AddressBar } from '../AddressBar';
import { ApplicationMenuButton } from '../ApplicationMenuButton';
import { NavigationBar } from '../NavigationBar';
import { HorizontalTabBar } from '../TabBar';
import { StyledContainer, StyledTitleBar, StyledWindowControls } from './styles';

export const TitleBar = () => {
    const { isMaximized, minimize, maximize, close } = useElectronAPI();
    const { config } = useUserConfigContext();

    const { palette } = useTheme();

    const style: AppearanceStyle = config.appearance.style;

    const [maximized, setMaximized] = useState(false);

    const requestMaximized = () => {
        isMaximized().then((result) => setMaximized(result));
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
                        {!isMac && <ApplicationMenuButton />}
                        <NavigationBar />
                        <AddressBar />
                        <Divider flexItem orientation="vertical" variant="middle" sx={{ gridArea: 'divider' }} />
                        <HorizontalTabBar />
                    </StyledContainer>
                );
            case 'top_double':
                return (
                    <StyledContainer className="title-bar-content" appearanceStyle={style}>
                        {!isMac && <ApplicationMenuButton />}
                        <HorizontalTabBar />
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
                    </StyledContainer>
                );
        }
    };

    return (
        <StyledTitleBar className="title-bar" appearanceStyle={style}>
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
