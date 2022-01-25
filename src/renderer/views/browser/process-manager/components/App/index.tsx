import { nativeTheme } from '@electron/remote';
import { Theme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { GlobalStyles, MuiDarkGlobalStyles, MuiLightGlobalStyles } from '../../../../../themes';
import { AppContent } from '../AppContent';
import { TitleBar } from '../TitleBar';
import { StyledApp } from './styles';

const Content = () => {
    return (
        <StyledApp>
            <TitleBar />
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
                <Helmet title="プロセス マネージャー" />
                <GlobalStyles />
                <Content />
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
