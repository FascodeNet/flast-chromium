import { app, ipcMain } from 'electron';
import Datastore from 'nedb';
import { join } from 'path';
import { IBookmark } from '../../../interfaces/user';
import { IBookmarks, IUser } from '../../interfaces/user';

export class NormalBookmarks implements IBookmarks {

    readonly user: IUser;

    private _datastore: Datastore;

    public constructor(user: IUser) {
        this.user = user;

        this._datastore = new Datastore<IBookmark>({
            filename: join(app.getPath('userData'), 'users', user.id, 'bookmarks.db'),
            autoload: true,
            timestampData: true
        });

        this._datastore.find({}, {}, (err, docs) => {
            if (err) throw new Error('The data could not be read!');
            this._bookmarks = docs;
        });


        ipcMain.handle(`bookmarks-${user.id}`, () => {
            return this.bookmarks;
        });

        ipcMain.handle(`bookmark-add-${user.id}`, (e, data: Omit<IBookmark, '_id' | 'updatedAt' | 'createdAt'>) => {
            this.add(data);
        });

        ipcMain.handle(`bookmark-remove-${user.id}`, (e, id: string) => {
            this.remove(id);
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
        this._datastore.insert(data, (err, doc) => {
            if (err) return;
            this._bookmarks.push(doc);
        });
    }

    public remove(id: string) {
        this._bookmarks = this._bookmarks.filter((data) => data._id !== id);
        this._datastore.remove({ _id: id });
    }
}
