import { PermissionType } from '../main/session/permission';
import { ZoomLevel } from './view';

export type UserType = 'normal' | 'incognito' | 'guest';

export interface UserData extends UserProfile {
    id: string;
}

export interface UserProfile {
    name: string;
    avatar: string | null;
}

export interface AdBlockerFilter {
    name: string;
    url: string;
    enabled: boolean;
}

export type AppearanceColorScheme = 'system' | 'light' | 'dark';
export type AppearanceSystemTheme = AppearanceColorScheme | 'incognito';
export type AppearanceInternalTheme = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';
export type AppearanceTheme = AppearanceInternalTheme | string | null;
export type AppearanceToolbarPosition = 'top' | 'bottom';
export type AppearanceTabContainerPosition = 'top' | 'bottom' | 'left' | 'right';
export type AppearanceTabContainerSidePosition = 'default' | 'outside' | 'inside';
export type AppearanceSidebarPosition = 'left' | 'right' | 'none';
export type AppearanceSidebarState =
    'tab_container'
    | 'bookmarks'
    | 'history'
    | 'downloads'
    | 'applications'
    | 'extensions';

export type StartupPageMode = 'new_tab' | 'prev_sessions' | 'custom';
export type HomeButtonPageMode = 'new_tab' | 'custom';
export type NewTabPageMode = 'default' | 'custom';
export type NewTabBackgroundStyle = 'none' | 'random' | 'custom';

export interface SearchEngine {
    name: string;
    url: string;
    mentions: string[];
}

export type ContentType = 'javascript' | 'images' | 'sounds' | 'ads' | 'protected_content';
export type PermissionDefaultCallback = 'confirm' | 'deny';
export type ContentDefaultCallback = 'allow' | 'deny';

export type Language = 'ja' | 'en';

export interface UserConfig {
    profile: UserProfile;
    account: {
        server: string | null;
        email: string;
        token: string;
    } | null;
    privacy_security: {
        send_dnt_request: boolean;
        save_history: boolean;
    };
    ad_blocker: {
        enabled: boolean;
        filters: AdBlockerFilter[];
    };
    appearance: {
        color_scheme: AppearanceColorScheme;
        theme: AppearanceTheme;
        tab_colored: boolean;
        fullscreen_showing_toolbar: boolean;
        toolbar_position: AppearanceToolbarPosition;
        tab_container: {
            expanded: boolean;
            position: AppearanceTabContainerPosition;
            side: AppearanceTabContainerSidePosition;
        }
        sidebar: {
            expanded: boolean;
            position: AppearanceSidebarPosition;
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
            mode: NewTabPageMode;
            url: string | null;
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
    download: {
        path: string;
        check_path_every: boolean;
        check_operation_every: boolean;
    };
    sites: {
        permissions: Record<PermissionType, PermissionDefaultCallback>;
        contents: Record<ContentType, ContentDefaultCallback> & {
            cookies: 'allow' | 'deny_3rd_party_in_incognito' | 'deny_3rd_party' | 'deny';
            zoom_level: ZoomLevel;
        }
    };
    language: {
        language: Language;
        spellcheck: boolean;
    };
    system_performance: {
        smooth_tab_switching: boolean;
    };
    version: number;
}

export const DefaultUserConfig: UserConfig = {
    profile: {
        name: '新しいユーザー',
        avatar: null
    },
    account: null,
    privacy_security: {
        send_dnt_request: false,
        save_history: true
    },
    ad_blocker: {
        enabled: false,
        filters: [
            {
                name: 'uBlock Origin — 基本フィルター',
                url: 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt',
                enabled: true
            },
            {
                name: 'uBlock Origin — 迷惑行為',
                url: 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/annoyances.txt',
                enabled: true
            },
            {
                name: 'uBlock Origin — 危険なプログラム',
                url: 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/badware.txt',
                enabled: true
            },
            {
                name: 'uBlock Origin — プライバシー',
                url: 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/privacy.txt',
                enabled: true
            },
            {
                name: 'uBlock Origin — クイック フィックス',
                url: 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/quick-fixes.txt',
                enabled: true
            },
            {
                name: 'uBlock Origin — システム リソースの濫用',
                url: 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/resource-abuse.txt',
                enabled: true
            },
            {
                name: 'uBlock Origin — アンブレイク',
                url: 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/unbreak.txt',
                enabled: true
            },
            {
                name: 'AdGuard — 日本語圏向けフィルター',
                url: 'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_7_Japanese/filter.txt',
                enabled: true
            },
            {
                name: 'EasyList',
                url: 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/thirdparties/easylist-downloads.adblockplus.org/easylist.txt',
                enabled: true
            },
            {
                name: 'EasyPrivacy',
                url: 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/thirdparties/easylist-downloads.adblockplus.org/easyprivacy.txt',
                enabled: true
            },
            {
                name: '悪意のある URL のブロック',
                url: 'https://malware-filter.gitlab.io/malware-filter/urlhaus-filter.txt',
                enabled: true
            }
        ]
    },
    appearance: {
        color_scheme: 'system',
        theme: null,
        tab_colored: true,
        fullscreen_showing_toolbar: true,
        toolbar_position: 'top',
        tab_container: {
            expanded: false,
            position: 'top',
            side: 'default'
        },
        sidebar: {
            expanded: false,
            position: 'none',
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
            mode: 'default',
            url: null,
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
    sites: {
        permissions: {
            geolocation: 'confirm',
            camera: 'confirm',
            microphone: 'confirm',
            notifications: 'confirm',
            sensors: 'confirm',
            midi: 'confirm',
            hid: 'confirm',
            serial: 'confirm',
            idle_detection: 'confirm',
            clipboard: 'confirm',
            pointer_lock: 'confirm',
            open_external: 'confirm'
        },
        contents: {
            cookies: 'deny_3rd_party_in_incognito',
            javascript: 'allow',
            images: 'allow',
            sounds: 'allow',
            ads: 'deny',
            protected_content: 'allow',
            zoom_level: 1.00
        }
    },
    download: {
        path: '',
        check_path_every: false,
        check_operation_every: false
    },
    language: {
        language: 'ja',
        spellcheck: true
    },
    system_performance: {
        smooth_tab_switching: true
    },
    version: 4
};

export interface ThemeManifest {
    name: string;
    description?: string;
    version: string;
    author?: string;
    background_color: string;
}

export interface IData {
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

export interface DownloadData extends IData {
    name?: string;
    url?: string;
    path?: string;
    icon?: string;
    mimeType?: string;
    totalBytes?: number;
    receivedBytes?: number;
    isPaused?: boolean;
    canResume?: boolean;
    state?: 'progressing' | 'completed' | 'cancelled' | 'interrupted' | 'waiting';
}

export interface SiteData extends IData {
    kind?: 'permission' | 'content';
    origin?: string;
}

export interface SitePermissionData extends SiteData {
    kind?: 'permission';
    type?: PermissionType;
    callback?: boolean;
}

export interface SiteContentData extends SiteData {
    kind?: 'content';
    type?: ContentType;
    callback?: boolean;
}

export interface SiteContentCookieData extends SiteData {
    kind?: 'content';
    type?: 'cookies';
    callback?: boolean;
    allow3rdParty?: boolean;
}

export interface SiteContentZoomLevelData extends SiteData {
    kind?: 'content';
    type?: 'zoom_level';
    level?: ZoomLevel;
}

export interface DataGroup<T extends IData> {
    date: Date;
    formatDate: string;
    list: T[];
}

export type OmitData<T extends IData> = Omit<T, '_id' | 'updatedAt' | 'createdAt'>;
