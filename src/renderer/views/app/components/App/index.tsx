import React, { Fragment } from 'react';
import { AppearanceInternalTheme, AppearanceTheme } from '../../../../../interfaces/user';
import { UserConfigProvider, useUserConfigContext } from '../../../../contexts/config';
import { ViewManagerProvider } from '../../../../contexts/view';
import { GlobalStyles } from '../../../../themes';
import { useTheme } from '../../../../utils/theme';
import { AppContent } from '../AppContent';
import { TitleBar } from '../TitleBar';
import { ToolBar } from '../ToolBar';
import { StyledApp } from './styles';


const isInternalTheme = (theme: AppearanceTheme): theme is AppearanceInternalTheme => {
    return true;
};

const Content = () => {
    const { config } = useUserConfigContext();
    const { mode: { path: modePath }, theme: { value: theme, path: themePath } } = useTheme();

    return (
        <Fragment>
            <link rel="stylesheet" type="text/css" href={modePath} />
            {theme && <link rel="stylesheet" type="text/css" href={themePath} />}
            <StyledApp className="app" appearanceStyle={config.appearance.style}>
                <TitleBar />
                {config.appearance.style === 'top_double' && <ToolBar />}
                <AppContent />
            </StyledApp>
        </Fragment>
    );
};

export const App = () => {
    return (
        <Fragment>
            <GlobalStyles />
            <UserConfigProvider>
                <ViewManagerProvider>
                    <Content />
                </ViewManagerProvider>
            </UserConfigProvider>
        </Fragment>
    );
};
