import { Extension, Session } from 'electron';
import { IExtensions, IUser } from '../../interfaces/user';

export class IncognitoExtensions implements IExtensions {

    public readonly user: IUser;

    public constructor(user: IUser) {
        this.user = user;
    }

    public async loads(ses: Session): Promise<Extension[]> {
        // throw new Error('This user is not allowed to use extensions!');
        return [];
    }
}
