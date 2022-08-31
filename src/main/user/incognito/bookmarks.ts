import Datastore from '@seald-io/nedb';
import { ipcMain } from 'electron';
import { IPCChannel } from '../../../constants/ipc';
import { BookmarkData, OmitData } from '../../../interfaces/user';
import { getUserDataPath } from '../../../utils/path';
import { IBookmarks, IUser } from '../../interfaces/user';
import { NormalUser } from '../normal';

export class IncognitoBookmarks implements IBookmarks {

    public readonly user: IUser;

    private readonly _datastore: Datastore;
    private _bookmarks: Required<BookmarkData>[] = [];

    private readonly ipcChannel = IPCChannel.Bookmarks;

    public constructor(user: IUser, fromUser: NormalUser) {
        this.user = user;

        this._datastore = new Datastore<BookmarkData>({
            filename: getUserDataPath(fromUser.id, 'Bookmarks.db'),
            autoload: true,
            timestampData: true
        });

        this._datastore.find({}, {}, (err, docs: Required<BookmarkData>[]) => {
            if (err) throw new Error('The data could not be read!');
            this._bookmarks = docs;
        });

        ipcMain.handle(this.ipcChannel.LIST(user.id), () => {
            return this.bookmarks;
        });
        ipcMain.handle(this.ipcChannel.ADD(user.id), async (e, data: OmitData<BookmarkData>) => {
            return await this.add(data);
        });
        ipcMain.handle(this.ipcChannel.REMOVE(user.id), async (e, id: string) => {
            return await this.remove(id);
        });
        ipcMain.handle(this.ipcChannel.UPDATE(user.id), async (e, id: string, data: OmitData<BookmarkData>) => {
            return await this.update(id, data);
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
        const doc = await this._datastore.insertAsync(data) as Required<BookmarkData>;
        this._bookmarks.push(doc);
        return doc;
    }

    public async remove(id: string) {
        const bookmark = this._bookmarks.find((data) => data._id === id);
        if (!bookmark)
            return false;

        if (bookmark.isFolder)
            await this.removeOf(id);

        this._bookmarks = this._bookmarks.filter((data) => data._id !== id);
        return await this._datastore.removeAsync({ _id: id }, {}) > 0;
    }

    private async removeOf(id: string) {
        const items = this._bookmarks.filter((data) => data.parent === id);
        for (const item of items) {
            this._bookmarks = this._bookmarks.filter((data) => data._id !== item._id);
            await this._datastore.removeAsync({ _id: item._id }, {});

            if (item.isFolder)
                await this.removeOf(item._id!!);
        }
    }

    public async update(id: string, data: OmitData<BookmarkData>) {
        const doc: Required<BookmarkData> = (await this._datastore.updateAsync(
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
