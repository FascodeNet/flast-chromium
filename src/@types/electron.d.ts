import { BookmarkData, HistoryData, HistoryGroup, OmitData, UserConfig } from '../interfaces/user';
import { Language } from '../languages/language';
import { DeepPartial } from '../utils';

export interface IElectronAPI {
    togglePictureInPicture: (index: number) => Promise<void>;

    getUser: () => Promise<string | undefined>;
    getLanguage: (userId: string) => Promise<Language>;
    getUserConfig: (userId: string) => Promise<UserConfig>;
    setUserConfig: (userId: string, config: DeepPartial<UserConfig>) => Promise<UserConfig>;
    setTheme: (userId: string) => Promise<void>;

    getBookmarks: (userId: string) => Promise<BookmarkData[]>;
    addBookmark: (userId: string, data: OmitData<BookmarkData>) => Promise<BookmarkData>;
    removeBookmark: (userId: string, bookmarkId: string) => Promise<boolean>;
    updateBookmark: (userId: string, bookmarkId: string, data: OmitData<BookmarkData>) => Promise<BookmarkData>;

    getHistory: (userId: string) => Promise<HistoryData[]>;
    getHistoryGroups: (userId: string) => Promise<HistoryGroup[]>;
}

declare global {

    interface Window {
        api: IElectronAPI;
    }
}
