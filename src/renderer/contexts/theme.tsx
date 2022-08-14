import { nativeTheme } from '@electron/remote';
import { ipcRenderer } from 'electron';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { IPCChannel } from '../../constants/ipc';
import { AppearanceSystemTheme, AppearanceTheme, UserType } from '../../interfaces/user';
import { getStylesPath, getUserDataPath } from '../../utils/path';
import { isInternalTheme } from '../../utils/theme';
import { useUserConfigContext } from './config';

export const getColorSchemePath = (scheme: AppearanceSystemTheme) => getStylesPath(scheme === 'system' ? (nativeTheme.shouldUseDarkColors ? 'dark' : 'light') : scheme, 'theme.css');
export const getThemePath = (theme: AppearanceTheme, userId: string, type: UserType) => theme && type !== 'incognito' ? (
    isInternalTheme(theme) ? getStylesPath(theme, 'theme.css') : getUserDataPath(userId, 'theme.css')
) : undefined;

export interface ThemeProps {
    colorScheme: {
        value: AppearanceSystemTheme;
        path: string;
    };
    theme: {
        value: AppearanceTheme;
        path?: string;
    };
}

export const ThemeContext = createContext<ThemeProps>({
    colorScheme: {
        value: 'system',
        path: getColorSchemePath('system')
    },
    theme: {
        value: null,
        path: undefined
    }
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
    children?: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const { userId, type, config } = useUserConfigContext();

    const context = useContext(ThemeContext);

    const [colorScheme, setColorScheme] = useState(context.colorScheme);
    const [theme, setTheme] = useState(context.theme);

    useEffect(() => {
        const channel = IPCChannel.User.UPDATED_THEME(userId);
        ipcRenderer.on(channel, (e, appearanceColorScheme: AppearanceSystemTheme, appearanceTheme: AppearanceTheme) => {
            if (!userId.startsWith('incognito_')) {
                setColorScheme({
                    value: appearanceColorScheme,
                    path: getColorSchemePath(appearanceColorScheme)
                });
                setTheme({
                    value: appearanceTheme,
                    path: getThemePath(appearanceTheme, userId, type)
                });
            } else {
                setColorScheme({
                    value: 'system',
                    path: getColorSchemePath('incognito')
                });
                setTheme({
                    value: null,
                    path: undefined
                });
            }
        });

        return () => {
            ipcRenderer.removeAllListeners(channel);
        };
    }, [userId]);

    useEffect(() => {
        if (!userId.startsWith('incognito_')) {
            const systemTheme: AppearanceSystemTheme = !userId.startsWith('incognito_') ? config.appearance.color_scheme : 'incognito';
            setColorScheme({
                value: systemTheme,
                path: getColorSchemePath(systemTheme)
            });
            setTheme({
                value: config.appearance.theme,
                path: getThemePath(config.appearance.theme, userId, type)
            });
        } else {
            setColorScheme({
                value: 'system',
                path: getColorSchemePath('incognito')
            });
            setTheme({
                value: null,
                path: undefined
            });
        }
    }, [config]);


    const value: ThemeProps = { colorScheme, theme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
