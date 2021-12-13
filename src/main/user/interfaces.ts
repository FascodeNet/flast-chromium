import { Extension, Session as ElectronSession } from 'electron';
import { ElectronChromeExtensions } from 'electron-chrome-extensions';
import Datastore from 'nedb';
import { UserConfig, UserType } from '../../interfaces/user';

export interface IUser {

    readonly id: string;

    name: string;
    avatar?: string;
    readonly type: UserType;

    get extensions(): IExtensions;

    get session(): ISession;

    get settings(): ISettings;

    get bookmarks(): IBookmarks;

    get histories(): IHistories;

    get downloads(): IDownloads;
}

export interface IExtensions {

    readonly user: IUser;

    loads(ses: ElectronSession): Promise<Extension[]>;
}

export interface ISession {

    readonly user: IUser;

    get session(): ElectronSession;

    get extensions(): ElectronChromeExtensions;
}

export interface ISettings {

    readonly user: IUser;

    get config(): UserConfig;

    set config(data: UserConfig | any);
}

export interface IBookmarks {

    readonly user: IUser;

    get datastore(): Datastore;
}

export interface IHistories {

    readonly user: IUser;

    get datastore(): Datastore;
}

export interface IDownloads {

    readonly user: IUser;

    get datastore(): Datastore;
}
