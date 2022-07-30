import Datastore from '@seald-io/nedb';
import { app } from 'electron';
import { join } from 'path';
import { BookmarkData, OmitData } from '../../../interfaces/user';
import { IBookmarks, IUser } from '../../interfaces/user';
import { NormalUser } from '../normal';

export class IncognitoBookmarks implements IBookmarks {

    public readonly user: IUser;

    private readonly _datastore: Datastore;
    private _bookmarks: BookmarkData[] = [];

    public constructor(user: IUser, fromUser: NormalUser) {
        this.user = user;

        this._datastore = new Datastore<BookmarkData>({
            filename: join(app.getPath('userData'), 'users', fromUser.id, 'bookmarks.db'),
            autoload: true,
            timestampData: true
        });

        this._datastore.find({}, {}, (err, docs) => {
            if (err) throw new Error('The data could not be read!');
            this._bookmarks = docs;
        });
    }

    public get datastore() {
        return this._datastore;
    }

    public get bookmarks() {
        return this._bookmarks;
    }

    public get folders() {
        return this._bookmarks.filter((data) => data.isFolder);
    }

    public async add(data: OmitData<BookmarkData>) {
        const doc: BookmarkData = await this._datastore.insertAsync(data);
        this._bookmarks.push(doc);
        return doc;
    }

    public async remove(id: string) {
        this._bookmarks = this._bookmarks.filter((data) => data._id !== id);
        return await this._datastore.removeAsync({ _id: id }, {}) > 0;
    }

    public async update(id: string, data: OmitData<BookmarkData>) {
        const doc: BookmarkData = (await this._datastore.updateAsync(
            { _id: id },
            { $set: data },
            {
                returnUpdatedDocs: true
            }
        )).affectedDocuments;

        const bookmarks = [...this._bookmarks];
        const index = bookmarks.findIndex((bookmark) => bookmark._id === id);

        if (index < 0) return Promise.reject();

        bookmarks[index] = doc;
        this._bookmarks = bookmarks;

        return doc;
    }
}
