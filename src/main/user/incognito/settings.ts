import deepmerge from 'deepmerge';
import { DefaultUserConfig, UserConfig } from '../../../interfaces/user';
import { DeepPartial } from '../../../utils';
import { ISettings, IUser } from '../../interfaces/user';
import { NormalUser } from '../normal';

export class IncognitoSettings implements ISettings {

    public readonly user: IUser;

    private _config: UserConfig = DefaultUserConfig;

    public constructor(user: IUser, fromUser: NormalUser) {
        this.user = user;

        this._config = fromUser.settings.config;
    }

    public get config(): UserConfig {
        return this._config;
    }

    public set config(data: DeepPartial<UserConfig>) {
        this._config = deepmerge<UserConfig>(this._config, data as any);
    }
}
