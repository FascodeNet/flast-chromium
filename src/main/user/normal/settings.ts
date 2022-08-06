import deepmerge from 'deepmerge';
import { readFile, writeFile } from 'fs/promises';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_HOME } from '../../../constants';
import { DefaultUserConfig, UserConfig } from '../../../interfaces/user';
import { DeepPartial } from '../../../utils';
import { getUserDataPath } from '../../../utils/path';
import { isURL } from '../../../utils/url';
import { ISettings, IUser } from '../../interfaces/user';

export class NormalSettings implements ISettings {

    public readonly user: IUser;

    private readonly path: string;

    private _config: UserConfig = DefaultUserConfig;

    public constructor(user: IUser) {
        this.user = user;

        this.path = getUserDataPath(user.id, 'config.json');
        this.getConfig().then((userConfig) => {
            this._config = deepmerge(DefaultUserConfig, this.migrate(userConfig), { arrayMerge: (target, source, options) => source });
        }).catch(async () => {
            await this.setConfig(DefaultUserConfig);
            this._config = DefaultUserConfig;
        });
    }

    public get startupUrls(): string[] {
        const { mode, urls } = this._config.pages.startup;
        switch (mode) {
            case 'new_tab':
                return [`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HOME}`];
            case 'prev_sessions':
                return [];
            case 'custom':
                return urls.filter((url) => url && isURL(url));
        }
    }

    public get homeUrl(): string {
        const { mode, url } = this._config.pages.home;
        return mode === 'custom' && url && isURL(url) ? url : `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HOME}`;
    }

    public get config(): UserConfig {
        return this._config;
    }

    public set config(data: DeepPartial<UserConfig>) {
        const config = deepmerge<UserConfig>(this._config, data as any);
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

    private async setConfig(userConfig: UserConfig) {
        await writeFile(this.path, JSON.stringify(userConfig));
    }

    private migrate(config: UserConfig): UserConfig {
        switch (config.version) {
            case undefined:
                config.version = 1;

                config.search = DefaultUserConfig.search;
        }

        return config;
    }
}
