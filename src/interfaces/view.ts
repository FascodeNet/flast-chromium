import { RequestState } from '../main/utils/request';

export interface AppViewInitializerOptions {
    url: string;
    incognito: boolean;
    active: boolean;
}

export const ZoomLevels: ZoomLevel[] = [.25, .33, .50, .67, .75, .80, .90, 1.00, 1.10, 1.25, 1.50, 1.75, 2.00, 2.50, 3.00, 4.00, 5.00];
export type ZoomLevel =
    .25
    | .33
    | .50
    | .67
    | .75
    | .80
    | .90
    | 1.00
    | 1.10
    | 1.25
    | 1.50
    | 1.75
    | 2.00
    | 2.50
    | 3.00
    | 4.00
    | 5.00;

export type MoveDirection = 'start' | 'end';

export type MediaStatus = 'audio' | 'movie' | 'muted' | 'none';

export interface ViewState {
    id: number;
    title: string;
    url: string;
    favicon?: string;
    color?: string;

    requestState?: RequestState;

    isLoading: boolean;
    canGoBack: boolean;
    canGoForward: boolean;

    media: MediaStatus;
    isPinned: boolean;

    findState?: FindState;
}

export const DefaultViewState: ViewState = {
    id: -1,
    title: '',
    url: '',
    favicon: undefined,
    color: undefined,

    requestState: undefined,

    isLoading: false,
    canGoBack: false,
    canGoForward: false,

    media: 'none',
    isPinned: false,

    findState: undefined
};

export interface FindState {
    text: string;
    matchCase: boolean;

    index: number;
    matches: number;

    finalUpdate: boolean;
}

export const DefaultFindState: FindState = {
    text: '',
    matchCase: false,

    index: 0,
    matches: 0,

    finalUpdate: false
};


export interface Favicon {
    url: string;
    favicon?: string;
}
