import { Extension, Session as ElectronSession } from 'electron';
import { ElectronChromeExtensions } from 'electron-chrome-extensions';
import Datastore from 'nedb';
import { IBookmark, IHistory, UserConfig, UserType } from '../../interfaces/user';
import { DeepPartial } from '../../utils';

export interface IUser {

    readonly id: string;

    readonly type: UserType;

    get name(): string;

    get avatar(): string | undefined;

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

    set config(data: DeepPartial<UserConfig>);
}

export interface IBookmarks {

    readonly user: IUser;

    get datastore(): Datastore;

    get bookmarks(): IBookmark[];

    get folders(): IBookmark[];

    add(data: IBookmark): void;

    remove(id: string): void;
}

export interface IHistories {

    readonly user: IUser;

    get datastore(): Datastore;

    get histories(): IHistory[];

    add(data: IHistory): void;

    remove(id: string): void;
}

export interface IDownloads {

    readonly user: IUser;

    get datastore(): Datastore;
}
