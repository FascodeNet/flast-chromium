import { app, nativeTheme } from '@electron/remote';
import { ipcRenderer } from 'electron';
import { join } from 'path';
import { useEffect, useState } from 'react';
import { AppearanceInternalTheme, AppearanceMode, AppearanceTheme } from '../../interfaces/user';
import { useUserConfigContext } from '../contexts/config';

const isInternalTheme = (theme: AppearanceTheme): theme is AppearanceInternalTheme => {
    return true;
};

interface Theme {
    mode: ThemeValue<AppearanceMode>;
    theme: ThemeValue<AppearanceTheme>;
}

interface ThemeValue<T> {
    value: T;
    path: string;
}

export const useTheme = (): Theme => {
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

    return {
        mode: {
            value: mode,
            path: modePath
        },
        theme: {
            value: theme,
            path: themePath
        }
    };
};
