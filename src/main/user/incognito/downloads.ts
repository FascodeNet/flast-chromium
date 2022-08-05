import Datastore from '@seald-io/nedb';
import { getUserDataPath } from '../../../utils/path';
import { IDownloads, IUser } from '../../interfaces/user';
import { NormalUser } from '../normal';

export class IncognitoDownloads implements IDownloads {

    public readonly user: IUser;

    private readonly _datastore: Datastore;

    public constructor(user: IUser, fromUser: NormalUser) {
        this.user = user;

        this._datastore = new Datastore({
            filename: getUserDataPath(fromUser.id, 'downloads.db'),
            autoload: true,
            timestampData: true
        });
    }

    public get datastore() {
        return this._datastore;
    }
}
