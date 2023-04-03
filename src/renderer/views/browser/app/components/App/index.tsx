import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { UserConfigProvider, useUserConfigContext } from '../../../../../contexts/config';
import { ThemeProvider, useThemeContext } from '../../../../../contexts/theme';
import { ViewManagerProvider } from '../../../../../contexts/view';
import { GlobalStyles } from '../../../../../themes';
import { useNativeTheme } from '../../../../../utils/electron';
import { AppBar } from '../AppBar';
import { AppContent } from '../AppContent';
import { HorizontalTabBar, VerticalTabBar } from '../TabBar';
import { TitleBar } from '../TitleBar';
import { StyledApp } from './styles';

const Content = () => {
    const {
        config: {
            appearance: {
                toolbar_position: position,
                tab_container: { position: tabContainerPosition, side: tabContainerSidePosition }
            }
        }
    } = useUserConfigContext();
    const { colorScheme: { path: modePath }, theme: { path: themePath } } = useThemeContext();

    return (
        <Fragment>
            <Helmet>
                <link rel="stylesheet" type="text/css" href={modePath} />
                {themePath && <link rel="stylesheet" type="text/css" href={themePath} />}
            </Helmet>
            <StyledApp
                className="app"
                data-toolbar-position={position}
                data-tabcontainer-position={tabContainerPosition}
                data-tabcontainer-side-position={tabContainerSidePosition}
            >
                <AppBar />
                <TitleBar />
                <HorizontalTabBar />
                <VerticalTabBar />
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
