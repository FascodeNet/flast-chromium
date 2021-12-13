import { UserType } from '../../../interfaces/user';
import { IUser } from '../interfaces';
import { NormalBookmarks } from './bookmarks';
import { NormalDownloads } from './downloads';
import { NormalExtensions } from './extensions';
import { NormalHistories } from './histories';
import { NormalSession } from './session';
import { NormalSettings } from './settings';

export class NormalUser implements IUser {

    public readonly id: string;

    public name: string = 'New user';
    public avatar?: string = undefined;
    public readonly type: UserType = 'normal';

    private _extensions: NormalExtensions;
    private _session: NormalSession;

    private _settings: NormalSettings;

    private _bookmarks: NormalBookmarks;
    private _histories: NormalHistories;
    private _downloads: NormalDownloads;

    constructor(id: string) {
        this.id = id;

        this._extensions = new NormalExtensions(this);
        this._session = new NormalSession(this);

        this._settings = new NormalSettings(this);

        this._bookmarks = new NormalBookmarks(this);
        this._histories = new NormalHistories(this);
        this._downloads = new NormalDownloads(this);
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
