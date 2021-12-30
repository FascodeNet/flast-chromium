import { ipcMain } from 'electron';
import Datastore from 'nedb';
import { IHistory } from '../../../interfaces/user';
import { IHistories, IUser } from '../../interfaces/user';
import { NormalUser } from '../normal';

export class IncognitoHistories implements IHistories {

    readonly user: IUser;

    public constructor(user: IUser, fromUser: NormalUser) {
        this.user = user;


        ipcMain.handle(`histories-${user.id}`, () => {
            return [];
        });

        ipcMain.handle(`history-add-${user.id}`, (e, data: IHistory) => {
            this.add(data);
        });

        ipcMain.handle(`history-remove-${user.id}`, (e, id: string) => {
            this.remove(id);
        });
    }

    public get datastore(): Datastore {
        throw new Error('This user is not allowed to use history!');
    }

    public get histories(): IHistory[] {
        throw new Error('This user is not allowed to use history!');
    }

    public add(data: IHistory) {
        throw new Error('This user is not allowed to use history!');
    }

    public remove(id: string) {
        throw new Error('This user is not allowed to use history!');
    }
}
