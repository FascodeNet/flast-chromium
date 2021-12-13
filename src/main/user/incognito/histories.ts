import Datastore from 'nedb';
import { IHistories, IUser } from '../interfaces';
import { NormalUser } from '../normal';

export class IncognitoHistories implements IHistories {

    readonly user: IUser;

    constructor(user: IUser, fromUser: NormalUser) {
        this.user = user;
    }

    public get datastore(): Datastore {
        throw new Error('This user is not allowed to use history!');
    }
}
