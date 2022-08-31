import { AppearanceInternalTheme, AppearanceSystemTheme, AppearanceTheme } from '../interfaces/user';
import { IUser } from '../main/interfaces/user';
import { getStylesPath, getUserDataPath } from './path';
import { parseHash } from './url';

export const isInternalTheme = (theme: AppearanceTheme): theme is AppearanceInternalTheme => {
    return true;
};

export const buildTheme = (user: IUser) => new URLSearchParams({
    userId: user.id,
    scheme: user.type !== 'incognito' ? user.settings.config.appearance.color_scheme : 'incognito',
    ...(user.settings.theme?.theme ? {
        theme: user.settings.theme.theme
    } : {})
});

export const parseTheme = () => {
    const { nativeTheme } = require('@electron/remote');

    const params = parseHash(window.location.hash);
    const userId = params.get('userId')!!;
    const scheme = (params.get('scheme') ?? 'system') as AppearanceSystemTheme;
    const theme: AppearanceTheme = params.get('theme') ?? null;

    return {
        userId,
        schemePath: getStylesPath(scheme === 'system' ? (nativeTheme.shouldUseDarkColors ? 'dark' : 'light') : scheme, 'theme.css'),
        themePath: theme ? (isInternalTheme(theme) ? getStylesPath(theme, 'theme.css') : getUserDataPath(userId, 'theme.css')) : undefined
    };
};
