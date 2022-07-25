import { IBookmark, IHistory, UserConfig } from '../interfaces/user';
import { Language } from '../languages/language';
import { DeepPartial } from '../utils';

export interface IElectronAPI {
    togglePictureInPicture: (index: number) => Promise<void>;

    getUser: () => Promise<string | undefined>;
    getLanguage: (userId: string) => Promise<Language>;
    getUserConfig: (userId: string) => Promise<UserConfig>;
    setUserConfig: (userId: string, config: DeepPartial<UserConfig>) => Promise<UserConfig>;
    setTheme: (userId: string) => Promise<void>;

    getBookmarks: (userId: string) => Promise<IBookmark[]>;
    getHistories: (userId: string) => Promise<IHistory[]>;
}

declare global {

    interface Window {
        api: IElectronAPI;
    }
}
