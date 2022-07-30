import { nanoid } from 'nanoid';
import { UserType } from '../../../interfaces/user';
import { IUser } from '../../interfaces/user';
import { NormalUser } from '../normal';
import { IncognitoBookmarks } from './bookmarks';
import { IncognitoDownloads } from './downloads';
import { IncognitoExtensions } from './extensions';
import { IncognitoHistory } from './history';
import { IncognitoSession } from './session';
import { IncognitoSettings } from './settings';

export class IncognitoUser implements IUser {

    public readonly id: string;

    public readonly fromUser: NormalUser;

    public readonly type: UserType = 'incognito';

    private readonly _extensions: IncognitoExtensions;
    private readonly _session: IncognitoSession;

    private readonly _settings: IncognitoSettings;

    private readonly _bookmarks: IncognitoBookmarks;
    private readonly _history: IncognitoHistory;
    private readonly _downloads: IncognitoDownloads;

    public constructor(fromUser: NormalUser) {
        this.id = `incognito_${nanoid()}`;

        this.fromUser = fromUser;

        this._extensions = new IncognitoExtensions(this);
        this._session = new IncognitoSession(this);

        this._settings = new IncognitoSettings(this, fromUser);

        this._bookmarks = new IncognitoBookmarks(this, fromUser);
        this._history = new IncognitoHistory(this, fromUser);
        this._downloads = new IncognitoDownloads(this, fromUser);
    }


    public get name() {
        return 'Incognito';
    }

    public get avatar() {
        return undefined;
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
