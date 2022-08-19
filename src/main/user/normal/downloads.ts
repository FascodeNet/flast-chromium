import Datastore from '@seald-io/nedb';
import { format } from 'date-fns';
import { ipcMain, shell } from 'electron';
import { IPCChannel } from '../../../constants/ipc';
import { DataGroup, DownloadData, OmitData } from '../../../interfaces/user';
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
        ipcMain.handle(this.ipcChannel.LIST_GROUPS(user.id), () => {
            return this.downloadGroups;
        });

        ipcMain.handle(IPCChannel.Downloads.OPEN_FILE(user.id), (e, id: string) => {
            const data = this._downloads.find((download) => download._id === id);
            if (!data || data.state !== 'completed') return;
            shell.openPath(data.path);
        });
        ipcMain.handle(IPCChannel.Downloads.OPEN_FOLDER(user.id), (e, id: string) => {
            const data = this._downloads.find((download) => download._id === id);
            if (!data || data.state !== 'completed') return;
            shell.showItemInFolder(data.path);
        });
        ipcMain.handle(IPCChannel.Downloads.PAUSE(user.id), (e, id: string) => {
            const item = user.session.downloadItems.get(id);
            if (!item || item.getState() !== 'progressing' && item.getState() !== 'interrupted') return;
            item.pause();
        });
        ipcMain.handle(IPCChannel.Downloads.RESUME(user.id), (e, id: string) => {
            const item = user.session.downloadItems.get(id);
            if (!item || item.getState() !== 'progressing' && item.getState() !== 'interrupted') return;
            item.resume();
        });
        ipcMain.handle(IPCChannel.Downloads.CANCEL(user.id), (e, id: string) => {
            const item = user.session.downloadItems.get(id);
            if (!item || item.getState() !== 'progressing' && item.getState() !== 'interrupted') return;
            item.cancel();
        });
        ipcMain.handle(IPCChannel.Downloads.RETRY(user.id), (e, id: string) => {
            const data = this._downloads.find((download) => download._id === id);
            if (!data || data.state !== 'cancelled') return;
            user.session.session.downloadURL(data.url);
        });
    }

    public get datastore() {
        return this._datastore;
    }

    public get downloads() {
        return this._downloads.sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1);
    }

    public get downloadGroups() {
        const predicate = (
            group: DataGroup<Required<DownloadData>>,
            date: Date
        ) => {
            return group.date.getFullYear() === date.getFullYear()
                && group.date.getMonth() === date.getMonth()
                && group.date.getDate() === date.getDate();
        };

        const downloadGroups: DataGroup<Required<DownloadData>>[] = [];

        this.downloads.forEach((downloadData) => {
            const date = new Date(downloadData.updatedAt);
            const object = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            const downloadGroup = downloadGroups.find((data) => predicate(data, object));
            const downloadGroupIndex = downloadGroups.findIndex((data) => predicate(data, object));

            if (downloadGroup) {
                downloadGroups[downloadGroupIndex] = {
                    ...downloadGroup,
                    list: [...downloadGroup.list, downloadData]
                };
            } else {
                downloadGroups.push(
                    {
                        date: object,
                        formatDate: format(object, 'yyyy/MM/dd'),
                        list: [downloadData]
                    }
                );
            }
        });

        return downloadGroups.sort((a, b) => a.date < b.date ? 1 : -1);
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
