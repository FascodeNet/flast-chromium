import deepmerge from 'deepmerge';
import { DefaultUserConfig, UserConfig } from '../../../interfaces/user';
import { ISettings, IUser } from '../interfaces';
import { NormalUser } from '../normal';

export class IncognitoSettings implements ISettings {

    readonly user: IUser;

    private _config: UserConfig = DefaultUserConfig;

    constructor(user: IUser, fromUser: NormalUser) {
        this.user = user;

        this._config = fromUser.settings.config;
    }

    public get config() {
        return this._config;
    }

    public set config(data: UserConfig | any) {
        this._config = deepmerge(this._config, data);
    }
}
