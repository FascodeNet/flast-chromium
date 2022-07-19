import { app, ipcMain } from 'electron';
import Datastore from 'nedb';
import { join } from 'path';
import { IHistory } from '../../../interfaces/user';
import { APPLICATION_PROTOCOL } from '../../../utils';
import { IHistories, IUser } from '../../interfaces/user';

export class NormalHistories implements IHistories {

    readonly user: IUser;

    private _datastore: Datastore;

    public constructor(user: IUser) {
        this.user = user;

        this._datastore = new Datastore<IHistory>({
            filename: join(app.getPath('userData'), 'users', user.id, 'histories.db'),
            autoload: true,
            timestampData: true
        });

        this._datastore.find({}, {}, (err, docs) => {
            if (err) throw new Error('The data could not be read!');
            this._histories = docs;
        });


        ipcMain.handle(`histories-${user.id}`, () => {
            return this.histories;
        });

        ipcMain.handle(`history-add-${user.id}`, (e, data: Omit<IHistory, '_id' | 'updatedAt' | 'createdAt'>) => {
            this.add(data);
        });

        ipcMain.handle(`history-remove-${user.id}`, (e, id: string) => {
            this.remove(id);
        });
    }

    private _histories: IHistory[] = [];

    public get datastore() {
        return this._datastore;
    }

    public get histories() {
        return this._histories.sort((a, b) => a.updatedAt!! < b.updatedAt!! ? 1 : -1);
    }

    public add(data: IHistory) {
        const isToday = (date: Date) => {
            const today = new Date();
            return date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
        };

        if (data.url) {
            const url = new URL(data.url);
            if (url.protocol === `${APPLICATION_PROTOCOL}:`)
                return;
        }

        this._datastore.update<IHistory>(
            {
                $where() {
                    return this.url === data.url && isToday(this.createdAt);
                }
            },
            data,
            {
                upsert: true,
                returnUpdatedDocs: true
            },
            (err, count, doc: IHistory) => {
                if (err) return;

                // tslint:disable-next-line:no-shadowed-variable
                this._histories = this._histories.filter((data) => data._id !== doc._id);
                this._histories.push(doc);
            }
        );
    }

    public remove(id: string) {
        this._histories = this._histories.filter((data) => data._id !== id);
        this._datastore.remove({ _id: id });
    }
}
