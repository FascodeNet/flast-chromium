import { BookmarkData, HistoryData, HistoryGroup, OmitData, UserConfig } from '../interfaces/user';
import { Language } from '../languages/language';
import { SearchResult } from '../main/utils/search';
import { DeepPartial } from '../utils';

export interface IFlastAPI {
    togglePictureInPicture: (index: number) => Promise<void>;

    getUser: () => Promise<string | undefined>;
    getLanguage: (userId: string) => Promise<Language>;
    getUserConfig: (userId: string) => Promise<UserConfig>;
    setUserConfig: (userId: string, config: DeepPartial<UserConfig>) => Promise<UserConfig>;
    setTheme: (userId: string) => Promise<void>;

    search: (userId: string, keyword: string) => Promise<SearchResult>;

    getBookmarks: (userId: string) => Promise<BookmarkData[]>;
    addBookmark: (userId: string, data: OmitData<BookmarkData>) => Promise<BookmarkData>;
    removeBookmark: (userId: string, bookmarkId: string) => Promise<boolean>;
    updateBookmark: (userId: string, bookmarkId: string, data: OmitData<BookmarkData>) => Promise<BookmarkData>;

    getHistory: (userId: string) => Promise<HistoryData[]>;
    getHistoryGroups: (userId: string) => Promise<HistoryGroup[]>;
}

declare global {

    interface Window {
        flast: IFlastAPI;
    }
}
