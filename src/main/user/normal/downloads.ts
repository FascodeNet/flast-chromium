import Datastore from '@seald-io/nedb';
import { app, ipcMain } from 'electron';
import { IPCChannel } from '../../../constants/ipc';
import { DownloadData, NativeDownloadData, OmitData } from '../../../interfaces/user';
import { getUserDataPath } from '../../../utils/path';
import { IDownloads, IUser } from '../../interfaces/user';

export class NormalDownloads implements IDownloads {

    public readonly user: IUser;

    private readonly _datastore: Datastore;
    private _downloads: Required<DownloadData>[] = [];

    private readonly ipcChannel = IPCChannel.Downloads;

    public constructor(user: IUser) {
        this.user = user;

        this._datastore = new Datastore<DownloadData>({
            filename: getUserDataPath(user.id, 'Downloads.db'),
            autoload: true,
            timestampData: true
        });

        this._datastore.find({}, {}, (err, docs: Required<DownloadData>[]) => {
            if (err) throw new Error('The data could not be read!');
            this._downloads = docs;
        });

        ipcMain.handle(this.ipcChannel.LIST(user.id), () => {
            return this.downloads;
        });
        ipcMain.handle(this.ipcChannel.LIST_WITH_FILE_ICON(user.id), async (e) => {
            const downloadDataList: NativeDownloadData[] = [];

            for (const download of this.downloads) {
                downloadDataList.push({
                    ...download,
                    icon: await app.getFileIcon(download.path)
                });
            }

            return downloadDataList;
        });
    }

    public get datastore() {
        return this._datastore;
    }

    public get downloads() {
        return this._downloads.sort((a, b) => a.updatedAt!! < b.updatedAt!! ? 1 : -1);
    }

    public async add(data: OmitData<DownloadData>) {
        const doc = await this._datastore.insertAsync(data) as Required<DownloadData>;
        this._downloads.push(doc);
        return doc;
    }

    public async remove(id: string) {
        this._downloads = this._downloads.filter((data) => data._id !== id);
        return await this._datastore.removeAsync({ _id: id }, {}) > 0;
    }

    public async update(id: string, data: OmitData<DownloadData>) {
        const doc: Required<DownloadData> = (await this._datastore.updateAsync(
            { _id: id },
            { $set: data },
            {
                returnUpdatedDocs: true
            }
        )).affectedDocuments;

        const downloads = [...this._downloads];
        const index = downloads.findIndex((download) => download._id === id);

        if (index < 0) return Promise.reject();

        downloads[index] = doc;
        this._downloads = downloads;

        return doc;
    }
}
