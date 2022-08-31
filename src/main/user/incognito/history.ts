import Datastore from '@seald-io/nedb';
import { ipcMain } from 'electron';
import { IPCChannel } from '../../../constants/ipc';
import { DataGroup, HistoryData, OmitData } from '../../../interfaces/user';
import { IHistory, IUser } from '../../interfaces/user';
import { NormalUser } from '../normal';

export class IncognitoHistory implements IHistory {

    public readonly user: IUser;

    private readonly ipcChannel = IPCChannel.History;

    public constructor(user: IUser, fromUser: NormalUser) {
        this.user = user;

        ipcMain.handle(this.ipcChannel.LIST(user.id), () => {
            return this.history;
        });
        ipcMain.handle(this.ipcChannel.LIST_GROUPS(user.id), () => {
            return this.historyGroups;
        });
        ipcMain.handle(this.ipcChannel.ADD(user.id), async (e, data: OmitData<HistoryData>) => {
            return await this.add(data);
        });
        ipcMain.handle(this.ipcChannel.REMOVE(user.id), async (e, id: string) => {
            return await this.remove(id);
        });
    }

    public get datastore(): Datastore {
        throw new Error('This user is not allowed to use history!');
    }

    public get history(): Required<HistoryData>[] {
        // throw new Error('This user is not allowed to use history!');
        return [];
    }

    public get historyGroups(): DataGroup<Required<HistoryData>>[] {
        return [];
    }

    public add(data: OmitData<HistoryData>) {
        return Promise.reject('This user is not allowed to use history!');
    }

    public remove(id: string) {
        return Promise.reject('This user is not allowed to use history!');
    }
}
