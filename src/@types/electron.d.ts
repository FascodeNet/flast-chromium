import { UserConfig } from '../interfaces/user';
import { Language } from '../languages/language';
import { DeepPartial } from '../utils';

export interface IElectronAPI {
    togglePictureInPicture: (index: number) => Promise<void>,

    getUser: () => Promise<string | undefined>,
    getLanguage: (id: string) => Promise<Language>,
    getUserConfig: (id: string) => Promise<UserConfig>,
    setUserConfig: (id: string, config: DeepPartial<UserConfig>) => Promise<UserConfig>,
    setTheme: (id: string) => Promise<void>,
}

declare global {

    interface Window {
        api: IElectronAPI;
    }
}
