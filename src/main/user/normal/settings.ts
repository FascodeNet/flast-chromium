import deepmerge from 'deepmerge';
import { readFile, writeFile } from 'fs/promises';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_HOME } from '../../../constants';
import { DefaultUserConfig, UserConfig } from '../../../interfaces/user';
import { DeepPartial } from '../../../utils';
import { getSpecialPath, getUserDataPath } from '../../../utils/path';
import { isURL } from '../../../utils/url';
import { ISettings, IUser } from '../../interfaces/user';
import { ThemeData } from '../theme';

export class NormalSettings implements ISettings {

    public readonly user: IUser;

    private readonly path: string;

    private _config: UserConfig = DefaultUserConfig;

    private _themeData?: ThemeData;

    public constructor(user: IUser) {
        this.user = user;

        this.path = getUserDataPath(user.id, 'Config.json');
        this.getConfig().then((userConfig) => {
            const config = deepmerge(DefaultUserConfig, this.migrate(userConfig), { arrayMerge: (target, source, options) => source });
            this._config = config;
            this._themeData = new ThemeData(this.user, config.appearance.theme);
        }).catch(async () => {
            await this.setConfig(DefaultUserConfig);
            this._config = DefaultUserConfig;
        });
    }

    public get theme(): ThemeData | undefined {
        return this._themeData;
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

        this._themeData = new ThemeData(this.user, config.appearance.theme);
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
                break;
            case 1:
                config.version = 2;
                config.appearance.color_scheme = (config.appearance as any).mode;
                config.system_performance = DefaultUserConfig.system_performance;

                delete (config.appearance as any).mode;
                delete (config.appearance as any).extended_sidebar;
                break;
            case 2:
                config.version = 3;
                config.ad_blocker = DefaultUserConfig.ad_blocker;
                break;
            case 3:
                config.version = 4;
                config.sites = DefaultUserConfig.sites;
                config.download = DefaultUserConfig.download;
                config.download.path = getSpecialPath('downloads');
                break;
        }

        return config.version >= DefaultUserConfig.version ? config : this.migrate(config);
    }
}
