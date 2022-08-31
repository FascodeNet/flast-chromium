import { nativeTheme } from '@electron/remote';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { getStylesPath } from '../../../../../../utils/path';
import { UserConfigProvider } from '../../../../../contexts/config';
import { ThemeProvider } from '../../../../../contexts/theme';
import { GlobalStyles } from '../../../../../themes';
import { useNativeTheme } from '../../../../../utils/electron';
import { AppContent } from '../AppContent';
import { TitleBar } from '../TitleBar';
import { StyledApp } from './styles';

export const App = () => {
    const theme = useNativeTheme();

    return (
        <MuiThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
                <GlobalStyles />
                <UserConfigProvider>
                    <ThemeProvider>
                        <Helmet>
                            <link
                                rel="stylesheet"
                                type="text/css"
                                href={getStylesPath(nativeTheme.shouldUseDarkColors ? 'dark' : 'light', 'theme.css')}
                            />
                        </Helmet>
                        <StyledApp className="app">
                            <TitleBar />
                            <AppContent />
                        </StyledApp>
                    </ThemeProvider>
                </UserConfigProvider>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
