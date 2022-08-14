import { NativeImage } from 'electron';
import { PermissionType } from '../main/session/permission';
import { ZoomLevel } from './view';

export type UserType = 'normal' | 'incognito' | 'guest';

export interface AdBlockerFilter {
    name: string;
    url: string;
    enabled: boolean;
}

export type AppearanceColorScheme = 'system' | 'light' | 'dark';
export type AppearanceSystemTheme = AppearanceColorScheme | 'incognito';
export type AppearanceInternalTheme = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';
export type AppearanceTheme = AppearanceInternalTheme | string | null;
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

export type ContentType = 'javascript' | 'images' | 'sounds' | 'ads' | 'protected_content';
export type PermissionDefaultCallback = 'confirm' | 'deny';
export type ContentDefaultCallback = 'allow' | 'deny';

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
    ad_blocker: {
        enabled: boolean;
        filters: AdBlockerFilter[];
    };
    appearance: {
        color_scheme: AppearanceColorScheme;
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
        name: 'New user',
        avatar: null
    },
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
    language: {
        language: 'ja',
        spellcheck: true
    },
    system_performance: {
        smooth_tab_switching: true
    },
    version: 3
};

export interface ThemeManifest {
    name: string;
    description?: string;
    version: string;
    author?: string;
    background_color: string;
}

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

export interface DownloadData extends IData {
    name?: string;
    path?: string;
    url?: string;
    mimeType?: string;
    totalBytes?: number;
    receivedBytes?: number;
    isPaused?: boolean;
    canResume?: boolean;
    state?: 'progressing' | 'completed' | 'cancelled' | 'interrupted';
}

export interface NativeDownloadData extends Required<DownloadData> {
    icon?: NativeImage;
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

export type OmitData<T extends IData> = Omit<T, '_id' | 'updatedAt' | 'createdAt'>;
