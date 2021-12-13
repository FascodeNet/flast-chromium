import { UserConfig } from '../interfaces/user';
import { Language } from '../languages/language';

export interface IElectronAPI {
    togglePictureInPicture: (index: number) => Promise<void>,

    getUser: () => Promise<string | undefined>,
    getLanguage: (id: string) => Promise<Language>,
    getUserConfig: (id: string) => Promise<UserConfig>,
    setUserConfig: (id: string, config: UserConfig | any) => Promise<void>,
}

declare global {

    interface Window {
        api: IElectronAPI;
    }
}
