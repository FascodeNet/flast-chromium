import deepmerge from 'deepmerge';
import { app } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { DefaultUserConfig, UserConfig } from '../../../interfaces/user';
import { DeepPartial } from '../../../utils';
import { ISettings, IUser } from '../../interfaces/user';

export class NormalSettings implements ISettings {

    public readonly user: IUser;

    private readonly path: string;

    private _config: UserConfig = DefaultUserConfig;

    public constructor(user: IUser) {
        this.user = user;

        this.path = join(app.getPath('userData'), 'users', user.id, 'config.json');
        this.getConfig().then((data) => {
            this._config = deepmerge(DefaultUserConfig, data);
        }).catch(async () => {
            await this.setConfig(DefaultUserConfig);
            this._config = DefaultUserConfig;
        });
    }

    public get config(): UserConfig {
        return this._config;
    }

    public set config(data: DeepPartial<UserConfig>) {
        const config = deepmerge(this._config, data as any);
        this._config = config;
        this.setConfig(config);
    }

    private async getConfig() {
        try {
            return JSON.parse(await readFile(this.path, 'utf8')) as UserConfig;
        } catch {
            return Promise.reject('User config not found!');
        }
    }

    private async setConfig(data: UserConfig) {
        await writeFile(this.path, JSON.stringify(data));
    }
}
