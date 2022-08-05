import Datastore from '@seald-io/nedb';
import { format } from 'date-fns';
import { ipcMain } from 'electron';
import { HistoryData, HistoryGroup, OmitData } from '../../../interfaces/user';
import { APPLICATION_PROTOCOL } from '../../../utils';
import { getUserDataPath } from '../../../utils/path';
import { IHistory, IUser } from '../../interfaces/user';

export class NormalHistory implements IHistory {

    public readonly user: IUser;

    private readonly _datastore: Datastore;
    private _history: HistoryData[] = [];

    public constructor(user: IUser) {
        this.user = user;

        this._datastore = new Datastore<HistoryData>({
            filename: getUserDataPath(user.id, 'history.db'),
            autoload: true,
            timestampData: true
        });

        this._datastore.find({}, {}, (err, docs) => {
            if (err) throw new Error('The data could not be read!');
            this._history = docs;
        });


        ipcMain.handle(`history-${user.id}`, () => {
            return this.history;
        });

        ipcMain.handle(`history-groups-${user.id}`, () => {
            return this.historyGroups;
        });

        ipcMain.handle(`history-add-${user.id}`, async (e, data: OmitData<HistoryData>) => {
            return await this.add(data);
        });

        ipcMain.handle(`history-remove-${user.id}`, async (e, id: string) => {
            return await this.remove(id);
        });
    }

    public get datastore() {
        return this._datastore;
    }

    public get history() {
        return this._history.sort((a, b) => a.updatedAt!! < b.updatedAt!! ? 1 : -1);
    }

    public get historyGroups() {
        const predicate = (
            historyGroup: HistoryGroup,
            date: Date
        ) => {
            return historyGroup.date.getFullYear() === date.getFullYear()
                && historyGroup.date.getMonth() === date.getMonth()
                && historyGroup.date.getDate() === date.getDate();
        };

        const historyGroups: HistoryGroup[] = [];

        this.history.forEach((historyData) => {
            const date = new Date(historyData.updatedAt!!);
            const object = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            const historyGroup = historyGroups.find((data) => predicate(data, object));
            const historyGroupIndex = historyGroups.findIndex((data) => predicate(data, object));

            if (historyGroup) {
                historyGroups[historyGroupIndex] = {
                    ...historyGroup,
                    history: [...historyGroup.history, historyData as Required<HistoryData>]
                };
            } else {
                historyGroups.push(
                    {
                        date: object,
                        formatDate: format(object, 'yyyy/MM/dd'),
                        history: [historyData as Required<HistoryData>]
                    }
                );
            }
        });

        return historyGroups;
    }

    public async add(data: OmitData<HistoryData>) {
        if (!this.user.settings.config.privacy_security.save_history) return Promise.reject();

        const isToday = (date: Date) => {
            const today = new Date();
            return date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
        };

        if (data.url) {
            const url = new URL(data.url);
            if (url.protocol === `${APPLICATION_PROTOCOL}:`)
                return Promise.reject();
        }

        const doc: HistoryData = (await this._datastore.updateAsync(
            {
                $where() {
                    return this.url === data.url && isToday(this.createdAt);
                }
            },
            data,
            {
                upsert: true,
                returnUpdatedDocs: true
            }
        )).affectedDocuments;

        this._history = this._history.filter((historyData) => historyData._id !== doc._id);
        this._history.push(doc);

        return doc;
    }

    public async remove(id: string) {
        this._history = this._history.filter((data) => data._id !== id);
        return await this._datastore.removeAsync({ _id: id }, {}) > 0;
    }
}
