export type UserType = 'normal' | 'incognito' | 'guest';


export type AppearanceMode = 'system' | 'light' | 'dark';
export type AppearanceStyle = 'top_single' | 'top_double' | 'bottom_single' | 'bottom_double' | 'left' | 'right';

export type StartupPageMode = 'new_tab' | 'prev_sessions' | 'custom';
export type HomeButtonPageMode = 'new_tab' | 'custom';
export type NewTabBackgroundStyle = 'none' | 'random' | 'custom';

export type Language = 'ja' | 'en';


export interface UserConfig {
    appearance: {
        mode: AppearanceMode;
        style: AppearanceStyle;
        extended_sidebar: boolean;
        buttons: {
            home: boolean;
            bookmarks: boolean;
            histories: boolean;
            downloads: boolean;
        }
    };
    pages: {
        startup: {
            mode: StartupPageMode;
            pages: string[]
        }
        home_button: {
            mode: HomeButtonPageMode;
            url?: string;
        }
        new_tab: {
            background: {
                style: NewTabBackgroundStyle;
                url?: string;
            }
        }
    },
    language: {
        language: Language,
        spellcheck: boolean
    };
}

export const DefaultUserConfig: UserConfig = {
    appearance: {
        mode: 'system',
        style: 'top_single',
        extended_sidebar: false,
        buttons: {
            home: false,
            bookmarks: false,
            histories: false,
            downloads: false
        }
    },
    pages: {
        startup: {
            mode: 'new_tab',
            pages: []
        },
        home_button: {
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

export const isHorizontal = (style: AppearanceStyle) => !isVertical(style);
export const isVertical = (style: AppearanceStyle) => style === 'left' || style === 'right';

export interface DefaultData {
    _id: string;
    updatedAt: string;
    createdAt: string;
}

export interface HistoryOption {
    title: string;
    url: string;
}

export interface History extends DefaultData, HistoryOption {
}
