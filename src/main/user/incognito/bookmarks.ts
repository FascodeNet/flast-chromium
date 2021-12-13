import { app } from 'electron';
import Datastore from 'nedb';
import { join } from 'path';
import { IBookmarks, IUser } from '../interfaces';
import { NormalUser } from '../normal';

export class IncognitoBookmarks implements IBookmarks {

    readonly user: IUser;

    private _datastore: Datastore;

    constructor(user: IUser, fromUser: NormalUser) {
        this.user = user;

        this._datastore = new Datastore({
            filename: join(app.getPath('userData'), 'users', fromUser.id, 'bookmarks.db'),
            autoload: true,
            timestampData: true
        });
    }

    public get datastore() {
        return this._datastore;
    }
}
