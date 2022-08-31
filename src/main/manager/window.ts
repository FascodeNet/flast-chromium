import { ipcMain } from 'electron';
import { IPCChannel } from '../../constants/ipc';
import { nonNullable } from '../../utils/array';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { IncognitoUser } from '../user/incognito';
import { NormalUser } from '../user/normal';
import { AppWindow } from '../windows/app';
import { ProcessManagerWindow } from '../windows/process-manager';

export class WindowManager {

    private _windows = new Map<number, AppWindow>();

    public selectedId: number = -1;
    public lastWindowId: number = -1;

    private processManagerWindow: ProcessManagerWindow | undefined;

    public constructor() {
        this.handleIpc();
    }

    public get windows(): AppWindow[] {
        return [...this._windows.values()].filter(nonNullable).filter((window) => !window.browserWindow.isDestroyed());
    }

    public getWindows(user: IUser): AppWindow[] {
        return this.windows.filter((window) => window.user.id === user.id);
    }

    public get(id: number = this.selectedId) {
        return this._windows.get(id ?? this.selectedId);
    }

    public add(user: IUser, urls: string[] = user.settings.startupUrls, active: boolean = true) {
        const window = new AppWindow(
            user,
            urls && urls.length > 0 ? urls : user.settings.startupUrls
        );

        this._windows.set(window.id, window);
        window.setApplicationMenu();
        window.setTouchBar();

        if (active) {
            window.browserWindow.once('ready-to-show', () => {
                this.selectedId = window.id;
                this.lastWindowId = window.id;
                window.browserWindow.show();
            });
        }

        return window;
    }

    public remove(id: number = this.selectedId) {
        const appWindow = this._windows.get(id);
        if (!appWindow) return;

        this.removeOf(appWindow);

        const windows = [...this.windows.values()];
        for (const window of windows) {
            window.setApplicationMenu();
            window.setTouchBar();
        }
    }

    public removeOthers(id: number = this.selectedId) {
        const appWindow = this._windows.get(id);
        if (!appWindow) return;

        const windows = this.getWindows(appWindow.user).filter((window) => window.id !== id);
        windows.forEach((window) => this.removeOf(window));

        setTimeout(() => {
            appWindow.setApplicationMenu();
            appWindow.setTouchBar();
        });
    }

    private removeOf(window: AppWindow) {
        this._windows.delete(window.id);

        if (window && !window.browserWindow.isDestroyed()) {
            window.viewManager.clear();
            window.browserWindow.close();
            window.browserWindow.destroy();
        }
    }

    public select(id: number) {
        const window = this._windows.get(id);
        if (!window) return;
        this.selectOf(window);
    }

    private selectOf(window: AppWindow) {
        if (window.browserWindow.isDestroyed()) {
            this._windows.delete(window.id);
            return;
        }

        this.selectedId = window.id;
        this.lastWindowId = window.id;
        window.setApplicationMenu();
        window.setTouchBar();
        window.browserWindow.show();
    }


    public openProcessManagerWindow() {
        if (!this.processManagerWindow) {
            const window = new ProcessManagerWindow();
            window.browserWindow.once('ready-to-show', () => window.browserWindow.show());
            window.browserWindow.webContents.once('destroyed', () => this.processManagerWindow = undefined);
            window.browserWindow.once('closed', () => this.processManagerWindow = undefined);
            this.processManagerWindow = window;
        } else {
            const window = this.processManagerWindow;
            window.browserWindow.reload();
            window.browserWindow.show();
        }
    }


    private handleIpc() {
        ipcMain.handle(IPCChannel.Windows.ADD(), (e, userId: string, urls: string[] | undefined) => {
            const user = Main.userManager.get(userId);
            if (!user)
                return;

            const window = this.add(user, urls ?? user.settings.startupUrls);
            return window.id;
        });

        ipcMain.handle(IPCChannel.Windows.OPEN_INCOGNITO(), (e, userId: string) => {
            const user = Main.userManager.get(userId);
            if (!user)
                return;

            if (user instanceof NormalUser) {
                const incognitoUser = Main.userManager.add(new IncognitoUser(user));
                const window = Main.windowManager.add(incognitoUser, undefined);
                return window.id;
            } else if (user instanceof IncognitoUser) {
                const incognitoUser = Main.userManager.add(new IncognitoUser(user.fromUser));
                const window = Main.windowManager.add(incognitoUser, undefined);
                return window.id;
            }
        });
    }
}
