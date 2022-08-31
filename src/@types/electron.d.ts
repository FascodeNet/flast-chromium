import { IpcRendererEvent } from 'electron';
import {
    BookmarkData,
    DataGroup,
    DownloadData,
    HistoryData,
    OmitData,
    UserConfig,
    UserProfile
} from '../interfaces/user';
import { Language } from '../languages/language';
import { SearchResult } from '../main/utils/search';
import { DeepPartial } from '../utils';

export interface IUserAPI {
    current: () => Promise<string | undefined>;
    language: (userId: string) => Promise<Language>;
    getConfig: (userId: string) => Promise<UserConfig>;
    setConfig: (userId: string, config: DeepPartial<UserConfig>) => Promise<UserConfig>;
    setTheme: (userId: string) => Promise<void>;
    setProfile: (userId: string, { name, avatar }: UserProfile) => Promise<UserProfile>;
}

export interface IBookmarksAPI {
    list: (userId: string) => Promise<Required<BookmarkData>[]>;
    add: (userId: string, data: OmitData<BookmarkData>) => Promise<Required<BookmarkData>>;
    remove: (userId: string, bookmarkId: string) => Promise<boolean>;
    update: (userId: string, bookmarkId: string, data: OmitData<BookmarkData>) => Promise<Required<BookmarkData>>;
}

export interface IHistoryAPI {
    list: (userId: string) => Promise<Required<HistoryData>[]>;
    listGroups: (userId: string) => Promise<DataGroup<Required<HistoryData>>[]>;
}

export interface IDownloadsAPI {
    list: (userId: string) => Promise<Required<DownloadData>[]>;
    listGroups: (userId: string) => Promise<DataGroup<Required<DownloadData>>[]>;

    openFile: (userId: string, downloadId: string) => Promise<void>;
    openFolder: (userId: string, downloadId: string) => Promise<void>;
    pause: (userId: string, downloadId: string) => Promise<void>;
    resume: (userId: string, downloadId: string) => Promise<void>;
    cancel: (userId: string, downloadId: string) => Promise<void>;
    retry: (userId: string, downloadId: string) => Promise<void>;

    openAction: (downloadId: string) => Promise<void>;
    saveAction: (downloadId: string) => Promise<void>;
    saveAsAction: (downloadId: string) => Promise<void>;
    cancelAction: (downloadId: string) => Promise<void>;

    onUpdated: (downloadId: string, callback: (event: IpcRendererEvent, data: Required<DownloadData>) => void) => void;
    removeUpdated: (downloadId: string) => void;
}

export interface IFlastAPI {
    togglePictureInPicture: (index: number) => Promise<void>;

    search: (userId: string, keyword: string) => Promise<SearchResult>;

    user: IUserAPI;
    bookmarks: IBookmarksAPI;
    history: IHistoryAPI;
    downloads: IDownloadsAPI;
}

declare global {

    interface Window {
        flast: IFlastAPI;
    }
}
