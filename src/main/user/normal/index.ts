import { app } from 'electron';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { UserType } from '../../../interfaces/user';
import { IUser } from '../../interfaces/user';
import { NormalBookmarks } from './bookmarks';
import { NormalDownloads } from './downloads';
import { NormalExtensions } from './extensions';
import { NormalHistories } from './histories';
import { NormalSession } from './session';
import { NormalSettings } from './settings';

export class NormalUser implements IUser {

    public readonly id: string;

    public readonly type: UserType = 'normal';

    private readonly path: string;

    private _extensions: NormalExtensions;
    private _session: NormalSession;

    private _settings: NormalSettings;

    private _bookmarks: NormalBookmarks;
    private _histories: NormalHistories;
    private _downloads: NormalDownloads;

    public constructor(id: string) {
        this.id = id;

        this.path = join(app.getPath('userData'), 'users', id);
        mkdir(this.path, { recursive: true });

        this._extensions = new NormalExtensions(this);
        this._session = new NormalSession(this);

        this._settings = new NormalSettings(this);

        this._bookmarks = new NormalBookmarks(this);
        this._histories = new NormalHistories(this);
        this._downloads = new NormalDownloads(this);
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

    public get histories() {
        return this._histories;
    }

    public get downloads() {
        return this._downloads;
    }
}
