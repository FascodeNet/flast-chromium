import { ipcMain } from 'electron';
import { mkdir } from 'fs/promises';
import { UserType } from '../../../interfaces/user';
import { getUserDataPath } from '../../../utils/path';
import { IUser } from '../../interfaces/user';
import { search } from '../../utils/search';
import { NormalBookmarks } from './bookmarks';
import { NormalDownloads } from './downloads';
import { NormalExtensions } from './extensions';
import { NormalHistory } from './history';
import { NormalSession } from './session';
import { NormalSettings } from './settings';

export class NormalUser implements IUser {

    public readonly id: string;

    public readonly type: UserType = 'normal';

    private readonly path: string;

    private readonly _extensions: NormalExtensions;
    private readonly _session: NormalSession;

    private readonly _settings: NormalSettings;

    private readonly _bookmarks: NormalBookmarks;
    private readonly _history: NormalHistory;
    private readonly _downloads: NormalDownloads;

    public constructor(id: string) {
        this.id = id;

        this.path = getUserDataPath(id);
        mkdir(this.path, { recursive: true });

        this._extensions = new NormalExtensions(this);
        this._session = new NormalSession(this);

        this._settings = new NormalSettings(this);

        this._bookmarks = new NormalBookmarks(this);
        this._history = new NormalHistory(this);
        this._downloads = new NormalDownloads(this);


        ipcMain.handle(`search-${this.id}`, async (e, keyword: string) => {
            return await search(keyword, this);
        });
    }


    public get name() {
        return this._settings.config.profile.name;
    }

    public get avatar() {
        return this._settings.config.profile.avatar;
    }


    public get extensions() {
        return this._extensions;
    }

    public get session() {
        return this._session;
    }


    public get settings() {
        return this._settings;
    }


    public get bookmarks() {
        return this._bookmarks;
    }

    public get history() {
        return this._history;
    }

    public get downloads() {
        return this._downloads;
    }
}
