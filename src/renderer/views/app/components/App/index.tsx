import { app, nativeTheme } from '@electron/remote';
import { ipcRenderer } from 'electron';
import { join } from 'path';
import React, { Fragment, useEffect, useState } from 'react';
import { AppearanceInternalTheme, AppearanceMode, AppearanceTheme } from '../../../../../interfaces/user';
import { UserConfigProvider, useUserConfigContext } from '../../../../contexts/config';
import { ViewManagerProvider } from '../../../../contexts/view';
import { GlobalStyles } from '../../../../themes';
import { AppContent } from '../AppContent';
import { TitleBar } from '../TitleBar';
import { ToolBar } from '../ToolBar';
import { StyledApp } from './styles';


const isInternalTheme = (theme: AppearanceTheme): theme is AppearanceInternalTheme => {
    return true;
};

const Content = () => {
    const { type, config } = useUserConfigContext();

    const [mode, setMode] = useState<AppearanceMode>(config.appearance.mode);
    const [theme, setTheme] = useState<AppearanceTheme>(config.appearance.theme);

    useEffect(() => {
        ipcRenderer.on('theme-update', (e) => {
            setMode(config.appearance.mode);
            setTheme(config.appearance.theme);
        });

        return () => {
            ipcRenderer.removeAllListeners('theme-update');
        };
    }, [config]);

    const modePath = type === 'incognito' ? join(
        app.getAppPath(),
        'static',
        'styles',
        'incognito.css'
    ) : join(
        app.getAppPath(),
        'static',
        'styles',
        `${nativeTheme.shouldUseDarkColors ? 'dark' : 'light'}.css`
    );

    const themePath = isInternalTheme(theme) ? join(
        app.getAppPath(),
        'static',
        'styles',
        `${theme}.css`
    ) : join(
        app.getPath('userData'),
        'theme.css'
    );

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
