import { ipcMain } from 'electron';
import { readFile, rmdir, stat, writeFile } from 'fs/promises';
import { nanoid } from 'nanoid';
import { DefaultUserConfig } from '../../interfaces/user';
import { getTranslate } from '../../languages/language';
import { getSpecialPath, getUserDataPath } from '../../utils/path';
import { GlobalConfig } from '../interfaces/config';
import { IUser } from '../interfaces/user';
import { App, Main } from '../main';
import { IncognitoUser } from '../user/incognito';
import { NormalUser } from '../user/normal';

export class UserManager {

    private loaded: boolean = false;

    private _users: Map<string, IUser> = new Map<string, IUser>();
    private _lastUserId?: string;

    public constructor() {
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
        UserManager.setConfig({ users: this.normalUsers.map((user) => user.id), lastUser: this.lastUserId });
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

    private static async load(id: string) {
        const user = new NormalUser(id);
        await user.extensions.loads();
        return user;
    }

    /**
     * ユーザーを新規作成します。
     *
     * @returns {Promise<IUser>}
     */
    public async create() {
        return this.add(await UserManager.load(nanoid()));
    }

    /**
     * 存在するユーザーを削除します。
     *
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    public async delete(id: string) {
        if (!this._users.has(id))
            return false;

        const path = getUserDataPath(id);
        try {
            const stats = await stat(path);
            if (!stats.isDirectory())
                return false;

            this._users.delete(id);
            await rmdir(path);
            await UserManager.setConfig({ users: this.normalUsers.map((user) => user.id), lastUser: this.lastUserId });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 存在するユーザーをすべて読み込みます。
     *
     * @returns {Promise<IUser[]>}
     */
    public async loads(): Promise<IUser[]> {
        try {
            const { users, lastUser } = await UserManager.getConfig();

            for (const user of users)
                this.add(await UserManager.load(user));

            this.lastUserId = lastUser;
            this.loaded = true;

            return this.users;
        } catch (e) {
            await UserManager.setConfig({ users: [], lastUser: undefined });

            this.lastUserId = undefined;
            this.loaded = true;

            return [];
        }
    }


    private static async getConfig(): Promise<GlobalConfig> {
        const configDataPath = getSpecialPath('userData', 'Config.json');
        return JSON.parse(await readFile(configDataPath, 'utf8'));
    }

    private static async setConfig(data: GlobalConfig) {
        const configDataPath = getSpecialPath('userData', 'Config.json');
        await writeFile(configDataPath, JSON.stringify(data));
    }

    private setupIpc() {
        ipcMain.handle('get-user', (e) => {
            const window = Main.windowManager.windows.find((appWindow) => appWindow.viewManager.get(e.sender.id));
            if (!window) return undefined;

            return window.user.id;
        });

        ipcMain.handle('user-language', (e, id: string) => {
            return getTranslate(this.get(id)?.settings.config ?? DefaultUserConfig);
        });

        ipcMain.handle(`set-theme`, (e, id: string) => {
            const user = this.get(id);
            if (!user) return;

            App.setTheme(user.settings.config);

            const windows = Main.windowManager.getWindows(user);
            windows.forEach(async (window) => await window.setStyle());
        });
    }
}
