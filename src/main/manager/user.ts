import { app, ipcMain } from 'electron';
import { readFile, rmdir, stat, writeFile } from 'fs/promises';
import { nanoid } from 'nanoid';
import { join } from 'path';
import { GlobalConfig } from '../../interfaces/config';
import { DefaultUserConfig, UserConfig } from '../../interfaces/user';
import { getTranslate } from '../../languages/language';
import { Main } from '../main';
import { IncognitoUser } from '../user/incognito';
import { IUser } from '../user/interfaces';
import { NormalUser } from '../user/normal';

export class UserManager {

    private loaded: boolean = false;

    private _users: Map<string, IUser> = new Map<string, IUser>();
    private _lastUserId?: string;

    constructor() {
        this.setupIpc();
    }

    public get isLoaded() {
        return this.loaded;
    }

    public get users() {
        return [...this._users.values()];
    }

    public get normalUsers(): NormalUser[] {
        return this.users.filter((value) => value.type === 'normal') as NormalUser[];
    }

    public get incognitoUsers(): IncognitoUser[] {
        return this.users.filter((value) => value.type === 'incognito') as IncognitoUser[];
    }


    public get lastUserId() {
        return this._lastUserId;
    }

    public set lastUserId(lastUserId: string | undefined) {
        this._lastUserId = lastUserId;
        UserManager.setConfig({ users: [...this._users.keys()], lastUser: this.lastUserId });
    }


    public get(id: string) {
        return this._users.get(id);
    }

    public add(user: IUser) {
        this._users.set(user.id, user);
        return user;
    }

    public remove(id: string) {
        this._users.delete(id);
    }

    public async create() {
        const user = await this.load(nanoid());
        await UserManager.setConfig({ users: [...this._users.keys()], lastUser: this.lastUserId });
        return user;
    }

    public async delete(id: string) {
        if (!this._users.has(id))
            return false;

        const userDataPath = join(app.getPath('userData'), 'users', id);
        try {
            const userDataStat = await stat(userDataPath);
            if (!userDataStat.isDirectory())
                return false;

            this._users.delete(id);
            await rmdir(userDataPath);
            await UserManager.setConfig({ users: [...this._users.keys()], lastUser: this.lastUserId });
            return true;
        } catch (e) {
            return false;
        }
    }

    public async load(id: string) {
        const user = new NormalUser(id);
        await user.extensions.loads(user.session.session);
        this._users.set(id, user);
        return user;
    }

    public async loads(): Promise<IUser[]> {
        try {
            const data = await UserManager.getConfig();

            for (let i = 0; i < data.users.length; i++)
                await this.load(data.users[i]);

            this.lastUserId = data.lastUser;
            this.loaded = true;

            return this.users;
        } catch (e) {
            await UserManager.setConfig({ users: [] });

            this.lastUserId = undefined;
            this.loaded = true;

            return [];
        }
    }


    private static async getConfig(): Promise<GlobalConfig> {
        const configDataPath = join(app.getPath('userData'), 'config.json');
        return JSON.parse(await readFile(configDataPath, 'utf8'));
    }

    private static async setConfig(data: GlobalConfig) {
        const configDataPath = join(app.getPath('userData'), 'config.json');
        await writeFile(configDataPath, JSON.stringify(data));
    }

    private setupIpc() {
        ipcMain.handle('get-user', (e) => {
            const window = Main.windowManager.getWindows().find((window) => window.viewManager.get(e.sender.id));
            if (!window) return undefined;

            return window.user.id;
        });

        ipcMain.handle('user-language', (e, id: string) => {
            return getTranslate(this.get(id)?.settings.config ?? DefaultUserConfig);
        });

        ipcMain.handle('get-user-config', (e, id: string) => {
            return this.get(id)?.settings.config ?? DefaultUserConfig;
        });
        ipcMain.handle(`set-user-config`, (e, id: string, config: UserConfig | any) => {
            const user = this.get(id);
            if (!user) return;

            user.settings.config = config;

            const windows = Main.windowManager.getWindows().filter((appWindow) => appWindow.user.id === user.id);
            windows.forEach((window) => {
                window.webContents.send('settings-update', user.settings.config);
                window.viewManager.get()?.setBounds();
            });
        });
    }
}
