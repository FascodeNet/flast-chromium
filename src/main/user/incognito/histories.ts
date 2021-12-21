import Datastore from 'nedb';
import { IHistory } from '../../../interfaces/user';
import { IHistories, IUser } from '../../interfaces/user';
import { NormalUser } from '../normal';

export class IncognitoHistories implements IHistories {

    readonly user: IUser;

    public constructor(user: IUser, fromUser: NormalUser) {
        this.user = user;
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
