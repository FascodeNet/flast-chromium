import { Extension, Session } from 'electron';
import { IExtensions, IUser } from '../interfaces';

export class IncognitoExtensions implements IExtensions {

    readonly user: IUser;

    constructor(user: IUser) {
        this.user = user;
    }

    public async loads(ses: Session): Promise<Extension[]> {
        // throw new Error('This user is not allowed to use extensions!');
        return [];
    }
}
