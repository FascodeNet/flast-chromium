import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import clsx from 'clsx';
import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { UserConfigProvider, useUserConfigContext } from '../../../../../contexts/config';
import { ThemeProvider, useThemeContext } from '../../../../../contexts/theme';
import { ViewManagerProvider } from '../../../../../contexts/view';
import { GlobalStyles } from '../../../../../themes';
import { useNativeTheme } from '../../../../../utils/electron';
import { AppContent } from '../AppContent';
import { TitleBar } from '../TitleBar';
import { ToolBar } from '../ToolBar';
import { StyledApp } from './styles';

const Content = () => {
    const { config } = useUserConfigContext();
    const { colorScheme: { path: modePath }, theme: { path: themePath } } = useThemeContext();

    return (
        <Fragment>
            <Helmet>
                <link rel="stylesheet" type="text/css" href={modePath} />
                {themePath && <link rel="stylesheet" type="text/css" href={themePath} />}
            </Helmet>
            <StyledApp
                data-style={config.appearance.style}
                className={clsx('app', config.appearance.style)}
                appearanceStyle={config.appearance.style}
            >
                <TitleBar />
                {config.appearance.style === 'top_double' && <ToolBar />}
                <AppContent />
            </StyledApp>
        </Fragment>
    );
};

export const App = () => {
    const nativeTheme = useNativeTheme();

    return (
        <MuiThemeProvider theme={nativeTheme}>
            <StyledThemeProvider theme={nativeTheme}>
                <GlobalStyles />
                <UserConfigProvider>
                    <ThemeProvider>
                        <ViewManagerProvider>
                            <Content />
                        </ViewManagerProvider>
                    </ThemeProvider>
                </UserConfigProvider>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
