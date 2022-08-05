export const APPLICATION_NAME = 'Flast';

export const APPLICATION_PROTOCOL = 'flast';
export const EXTENSION_PROTOCOL = 'chrome-extension';

export const APPLICATION_WEB_HOME = 'home';
export const APPLICATION_WEB_BOOKMARKS = 'bookmarks';
export const APPLICATION_WEB_HISTORY = 'history';
export const APPLICATION_WEB_DOWNLOADS = 'downloads';
export const APPLICATION_WEB_APPLICATIONS = 'applications';
export const APPLICATION_WEB_SETTINGS = 'settings';
export const APPLICATION_WEB_EXTENSIONS = 'extensions';

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T;

export const equals = (s1: string, s2: string, ignoreCase: boolean = false) =>
    ignoreCase ? s1.toLowerCase() === s2.toLowerCase() : s1 === s2;

export const includes = (s1: string, s2: string, ignoreCase: boolean = false) =>
    ignoreCase ? s1.toLowerCase().includes(s2.toLowerCase()) : s1.includes(s2);

export const startsWith = (s1: string, s2: string, ignoreCase: boolean = false) =>
    ignoreCase ? s1.toLowerCase().startsWith(s2.toLowerCase()) : s1.startsWith(s2);

export const endsWith = (s1: string, s2: string, ignoreCase: boolean = false) =>
    ignoreCase ? s1.toLowerCase().endsWith(s2.toLowerCase()) : s1.endsWith(s2);
