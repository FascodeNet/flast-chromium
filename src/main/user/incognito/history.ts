import Datastore from '@seald-io/nedb';
import { ipcMain } from 'electron';
import { HistoryData, HistoryGroup, OmitData } from '../../../interfaces/user';
import { IHistory, IUser } from '../../interfaces/user';
import { NormalUser } from '../normal';

export class IncognitoHistory implements IHistory {

    public readonly user: IUser;

    public constructor(user: IUser, fromUser: NormalUser) {
        this.user = user;


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

    public get datastore(): Datastore {
        throw new Error('This user is not allowed to use history!');
    }

    public get history(): HistoryData[] {
        // throw new Error('This user is not allowed to use history!');
        return [];
    }

    public get historyGroups(): HistoryGroup[] {
        return [];
    }

    public add(data: OmitData<HistoryData>) {
        return Promise.reject('This user is not allowed to use history!');
    }

    public remove(id: string) {
        return Promise.reject('This user is not allowed to use history!');
    }
}
