import Datastore from '@seald-io/nedb';
import { Extension, Session as ElectronSession } from 'electron';
import { ElectronChromeExtensions } from 'electron-chrome-extensions';
import { BookmarkData, HistoryData, HistoryGroup, OmitData, UserConfig, UserType } from '../../interfaces/user';
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

    get history(): IHistory;

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

    get bookmarks(): BookmarkData[];

    get folders(): BookmarkData[];

    add(data: OmitData<BookmarkData>): Promise<BookmarkData>;

    remove(id: string): Promise<boolean>;

    update(id: string, data: OmitData<BookmarkData>): Promise<BookmarkData>;
}

export interface IHistory {

    readonly user: IUser;

    get datastore(): Datastore;

    get history(): HistoryData[];

    get historyGroups(): HistoryGroup[];

    add(data: OmitData<HistoryData>): Promise<HistoryData>;

    remove(id: string): Promise<boolean>;
}

export interface IDownloads {

    readonly user: IUser;

    get datastore(): Datastore;
}
