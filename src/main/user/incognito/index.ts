import { nanoid } from 'nanoid';
import { UserType } from '../../../interfaces/user';
import { IUser } from '../interfaces';
import { NormalUser } from '../normal';
import { IncognitoBookmarks } from './bookmarks';
import { IncognitoDownloads } from './downloads';
import { IncognitoExtensions } from './extensions';
import { IncognitoHistories } from './histories';
import { IncognitoSession } from './session';
import { IncognitoSettings } from './settings';

export class IncognitoUser implements IUser {

    public readonly id: string;

    public readonly fromUser: NormalUser;

    public readonly name: string = 'Incognito';
    public readonly avatar?: string = undefined;
    public readonly type: UserType = 'incognito';

    private _extensions: IncognitoExtensions;
    private _session: IncognitoSession;

    private _settings: IncognitoSettings;

    private _bookmarks: IncognitoBookmarks;
    private _histories: IncognitoHistories;
    private _downloads: IncognitoDownloads;

    constructor(fromUser: NormalUser) {
        this.id = `incognito_${nanoid()}`;

        this.fromUser = fromUser;

        this._extensions = new IncognitoExtensions(this);
        this._session = new IncognitoSession(this);

        this._settings = new IncognitoSettings(this, fromUser);

        this._bookmarks = new IncognitoBookmarks(this, fromUser);
        this._histories = new IncognitoHistories(this, fromUser);
        this._downloads = new IncognitoDownloads(this, fromUser);
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
