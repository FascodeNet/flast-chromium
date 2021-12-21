import { app } from 'electron';
import Datastore from 'nedb';
import { join } from 'path';
import { IBookmark } from '../../../interfaces/user';
import { IBookmarks, IUser } from '../../interfaces/user';
import { NormalUser } from '../normal';

export class IncognitoBookmarks implements IBookmarks {

    readonly user: IUser;

    private _datastore: Datastore;

    public constructor(user: IUser, fromUser: NormalUser) {
        this.user = user;

        this._datastore = new Datastore<IBookmark>({
            filename: join(app.getPath('userData'), 'users', fromUser.id, 'bookmarks.db'),
            autoload: true,
            timestampData: true
        });

        this._datastore.find({}, {}, (err, docs) => {
            if (err) throw new Error('The data could not be read!');
            this._bookmarks = docs;
        });
    }

    private _bookmarks: IBookmark[] = [];

    public get datastore() {
        return this._datastore;
    }

    public get bookmarks() {
        return this._bookmarks;
    }

    public get folders() {
        return this._bookmarks.filter((data) => data.isFolder);
    }

    public add(data: IBookmark) {
        this._bookmarks.push(data);
        this._datastore.insert(data);
    }

    public remove(id: string) {
        this._bookmarks = this._bookmarks.filter((data) => data._id !== id);
        this._datastore.remove({ _id: id });
    }
}
