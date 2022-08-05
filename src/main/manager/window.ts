import { nonNullable } from '../../utils/array';
import { IUser } from '../interfaces/user';
import { AppWindow } from '../windows/app';
import { ProcessManagerWindow } from '../windows/process-manager';

export class WindowManager {

    public windows = new Map<number, AppWindow>();

    public selectedId: number = -1;
    public lastWindowId: number = -1;

    private processManagerWindow: ProcessManagerWindow | undefined;

    public constructor() {

    }

    public getWindows(user: IUser | undefined = undefined): AppWindow[] {
        const windows: AppWindow[] = [...this.windows.values()].filter(nonNullable).filter((window) => !window.browserWindow.isDestroyed());
        return user ? windows.filter((window) => window.user.id === user.id) : windows;
    }

    public get(id: number = this.selectedId) {
        return this.windows.get(id ?? this.selectedId);
    }

    public add(user: IUser, urls: string[] = user.settings.startupUrls, active: boolean = true) {
        const window = new AppWindow(
            user,
            {
                urls: urls ?? user.settings.startupUrls,
                active: active ?? true
            }
        );

        this.windows.set(window.id, window);
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
        const window = this.windows.get(id);
        if (!window) return;

        this.removeOf(window);

        const windows = [...this.windows.values()];
        for (const window of windows) {
            window.setApplicationMenu();
            window.setTouchBar();
        }
    }

    public removeOthers(id: number = this.selectedId) {
        const window = this.windows.get(id);
        if (!window) return;

        const windows = this.getWindows(window.user).filter((view) => view.id !== id);
        windows.forEach((window) => this.removeOf(window));

        setTimeout(() => {
            window.setApplicationMenu();
            window.setTouchBar();
        });
    }

    private removeOf(window: AppWindow) {
        this.windows.delete(window.id);

        if (window && !window.browserWindow.isDestroyed()) {
            window.viewManager.clear();
            window.browserWindow.close();
            window.browserWindow.destroy();
        }
    }

    public select(id: number) {
        const window = this.windows.get(id);
        if (!window) return;
        this.selectOf(window);
    }

    private selectOf(window: AppWindow) {
        if (window.browserWindow.isDestroyed()) {
            this.windows.delete(window.id);
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
            window.browserWindow.webContents.on('destroyed', () => this.processManagerWindow = undefined);
            window.browserWindow.on('closed', () => this.processManagerWindow = undefined);
            this.processManagerWindow = window;
        } else {
            const window = this.processManagerWindow;
            window.browserWindow.reload();
            window.browserWindow.show();
        }
    }
}
