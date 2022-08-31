import { Extension } from 'electron';
import { IExtensions, IUser } from '../../interfaces/user';

export class IncognitoExtensions implements IExtensions {

    public readonly user: IUser;

    public constructor(user: IUser) {
        this.user = user;
    }

    public async load(id: string): Promise<Extension | undefined> {
        // throw new Error('This user is not allowed to use extensions!');
        return undefined;
    }

    public unload(id: string) {
        // throw new Error('This user is not allowed to use extensions!');
        return;
    }

    public async loads(): Promise<Extension[]> {
        // throw new Error('This user is not allowed to use extensions!');
        return [];
    }
}
