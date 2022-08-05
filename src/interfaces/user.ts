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

export interface SearchEngine {
    name: string;
    url: string;
    mentions: string[];
}

export type Language = 'ja' | 'en';


export interface UserConfig {
    profile: {
        name: string;
        avatar: string | null;
    };
    privacy_security: {
        send_dnt_request: boolean;
        save_history: boolean;
    };
    appearance: {
        mode: AppearanceMode;
        theme: AppearanceTheme;
        tab_colored: boolean;
        style: AppearanceStyle;
        fullscreen_showing_toolbar: boolean;
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
            url: string | null;
        }
        new_tab: {
            background: {
                style: NewTabBackgroundStyle;
                url: string | null;
            }
        }
    };
    search: {
        suggests: {
            search: boolean;
            bookmarks: boolean;
            history: boolean;
        }
        default_engine: number;
        suggest_engine: boolean;
        engines: SearchEngine[];
    };
    language: {
        language: Language,
        spellcheck: boolean
    };
    version: number;
}

export const DefaultUserConfig: UserConfig = {
    profile: {
        name: 'New user',
        avatar: null
    },
    privacy_security: {
        send_dnt_request: false,
        save_history: true
    },
    appearance: {
        mode: 'system',
        theme: undefined,
        tab_colored: true,
        style: 'top_single',
        fullscreen_showing_toolbar: true,
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
            url: null
        },
        new_tab: {
            background: {
                style: 'random',
                url: null
            }
        }
    },
    search: {
        suggests: {
            search: true,
            bookmarks: true,
            history: true
        },
        default_engine: 0,
        suggest_engine: true,
        engines: [
            {
                name: 'Google',
                url: 'https://www.google.com/search?q=%s',
                mentions: ['google']
            },
            {
                name: 'Bing',
                url: 'https://www.bing.com/search?q=%s',
                mentions: ['bing']
            },
            {
                name: 'Yahoo! Japan',
                url: 'https://search.yahoo.co.jp/search?p=%s',
                mentions: ['yahoo']
            },
            {
                name: 'DuckDuckGo',
                url: 'https://duckduckgo.com/?q=%s',
                mentions: ['duckduckgo']
            },
            {
                name: 'Google 翻訳',
                url: 'https://translate.google.com/?text=%s',
                mentions: ['translate']
            },
            {
                name: 'DeepL 翻訳',
                url: 'https://www.deepl.com/ja/translator#auto/ja/%s',
                mentions: ['deepl']
            },
            {
                name: 'Google マップ',
                url: 'https://www.google.co.jp/maps/search/%s',
                mentions: ['map']
            },
            {
                name: 'YouTube',
                url: 'https://www.youtube.com/results?search_query=%s',
                mentions: ['youtube', 'yt']
            },
            {
                name: 'ニコニコ動画',
                url: 'https://www.nicovideo.jp/search/%s',
                mentions: ['nicovideo', 'niconico']
            },
            {
                name: 'Twitter',
                url: 'https://www.twitter.com/search?q=%s',
                mentions: ['twitter']
            },
            {
                name: 'GitHub',
                url: 'https://github.com/search?q=%s',
                mentions: ['github']
            },
            {
                name: 'Amazon',
                url: 'https://www.amazon.co.jp/s?k=%s',
                mentions: ['amazon']
            }
        ]
    },
    language: {
        language: 'ja',
        spellcheck: true
    },
    version: 1
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
