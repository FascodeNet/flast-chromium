import { nativeTheme } from '@electron/remote';
import { Theme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { UserConfigProvider, useUserConfigContext } from '../../../../contexts/config';
import { ViewManagerProvider } from '../../../../contexts/view';
import { GlobalStyles, MuiDarkGlobalStyles, MuiLightGlobalStyles } from '../../../../themes';
import { AppContent } from '../AppContent';
import { TitleBar } from '../TitleBar';
import { ToolBar } from '../ToolBar';
import { StyledApp } from './styles';

const Content = () => {
    const { config } = useUserConfigContext();

    return (
        <StyledApp appearanceStyle={config.appearance.style}>
            <TitleBar />
            {config.appearance.style === 'top_double' && <ToolBar />}
            <AppContent />
        </StyledApp>
    );
};

export const App = () => {
    const [theme, setTheme] = useState<Theme>(MuiLightGlobalStyles);

    useEffect(() => {
        setTheme(nativeTheme.shouldUseDarkColors ? MuiDarkGlobalStyles : MuiLightGlobalStyles);
    }, [nativeTheme.shouldUseDarkColors]);

    return (
        <MuiThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
                <GlobalStyles />
                <UserConfigProvider>
                    <ViewManagerProvider>
                        <Content />
                    </ViewManagerProvider>
                </UserConfigProvider>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
