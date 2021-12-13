import { app } from 'electron';
import Datastore from 'nedb';
import { join } from 'path';
import { IDownloads, IUser } from '../interfaces';

export class NormalDownloads implements IDownloads {

    readonly user: IUser;

    private _datastore: Datastore;

    constructor(user: IUser) {
        this.user = user;

        this._datastore = new Datastore({
            filename: join(app.getPath('userData'), 'users', user.id, 'downloads.db'),
            autoload: true,
            timestampData: true
        });
    }

    public get datastore() {
        return this._datastore;
    }
}
