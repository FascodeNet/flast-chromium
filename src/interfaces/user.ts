export type UserType = 'normal' | 'incognito' | 'guest';
export type AppearanceInternalTheme =
    'morning_fog'
    | 'icy_mint'
    | 'island_getaway'
    | 'cool_breeze'
    | 'silky_pink'
    | 'bubblegum'
    | 'sunny_day'
    | 'mango_paradise'
    | 'dark_and_stormy'
    | 'cool_slate'
    | 'moonlight_glow'
    | 'juicy_plum'
    | 'spicy_red'
    | 'mystical_forest';


export type AppearanceMode = 'system' | 'light' | 'dark';
export type AppearanceTheme = undefined | AppearanceInternalTheme | string;
export type AppearanceStyle = 'top_single' | 'top_double' | 'bottom_single' | 'bottom_double' | 'left' | 'right';
export type AppearanceSidebarState =
    'tab_container'
    | 'bookmarks'
    | 'history'
    | 'downloads'
    | 'applications'
    | 'extensions';

export type StartupPageMode = 'new_tab' | 'prev_sessions' | 'custom';
export type HomeButtonPageMode = 'new_tab' | 'custom';
export type NewTabBackgroundStyle = 'none' | 'random' | 'custom';

export type Language = 'ja' | 'en';


export interface UserConfig {
    profile: {
        name: string;
        avatar?: string;
    };
    privacy_security: {
        save_history: boolean;
        suggests: {
            search: boolean;
            bookmarks: boolean;
            history: boolean;
        }
    };
    appearance: {
        mode: AppearanceMode;
        theme: AppearanceTheme;
        tab_colored: boolean;
        style: AppearanceStyle;
        fullscreen_showing_toolbar: boolean;
        extended_sidebar: boolean;
        sidebar: {
            extended: boolean;
            state: AppearanceSidebarState;
        }
        buttons: {
            home: boolean;
            bookmarks: boolean;
            history: boolean;
            downloads: boolean;
            applications: boolean;
            extensions: boolean;
        }
    };
    pages: {
        startup: {
            mode: StartupPageMode;
            urls: string[];
        }
        home: {
            mode: HomeButtonPageMode;
            url?: string;
        }
        new_tab: {
            background: {
                style: NewTabBackgroundStyle;
                url?: string;
            }
        }
    };
    language: {
        language: Language,
        spellcheck: boolean
    };
}

export const DefaultUserConfig: UserConfig = {
    profile: {
        name: 'New user',
        avatar: undefined
    },
    privacy_security: {
        save_history: true,
        suggests: {
            search: true,
            bookmarks: true,
            history: true
        }
    },
    appearance: {
        mode: 'system',
        theme: undefined,
        tab_colored: true,
        style: 'top_single',
        fullscreen_showing_toolbar: true,
        extended_sidebar: false,
        sidebar: {
            extended: false,
            state: 'tab_container'
        },
        buttons: {
            home: false,
            bookmarks: false,
            history: false,
            downloads: false,
            applications: false,
            extensions: false
        }
    },
    pages: {
        startup: {
            mode: 'new_tab',
            urls: []
        },
        home: {
            mode: 'new_tab',
            url: undefined
        },
        new_tab: {
            background: {
                style: 'random',
                url: undefined
            }
        }
    },
    language: {
        language: 'ja',
        spellcheck: true
    }
};

interface IData {
    _id?: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface BookmarkData extends IData {
    title?: string;
    url?: string;
    favicon?: string;
    isFolder?: boolean;
    parent?: string;
}

export interface HistoryData extends IData {
    title?: string;
    url?: string;
    favicon?: string;
}

export interface HistoryGroup {
    date: Date;
    formatDate: string;
    history: Required<HistoryData>[];
}

export type OmitData<T extends IData> = Omit<T, '_id' | 'updatedAt' | 'createdAt'>;
