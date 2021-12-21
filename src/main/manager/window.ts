import { nonNullable } from '../../utils/array';
import { IUser } from '../interfaces/user';
import { AppWindow } from '../windows/app';
import { ProcessManagerWindow } from '../windows/process-manager';

export class WindowManager {
    public windows = new Map<number, AppWindow>();

    public selectedId: number = -1;

    private processManagerWindow: ProcessManagerWindow | undefined;

    public constructor() {

    }

    public getWindows(): AppWindow[] {
        return [...this.windows.values()].filter(nonNullable).filter((window: AppWindow) => !window.browserWindow.isDestroyed());
    }

    public get(id: number = this.selectedId) {
        return this.windows.get(id ?? this.selectedId);
    }

    public add(user: IUser, urls: string[] = ['https://www.google.com'], active: boolean = true) {
        const window = new AppWindow(
            user,
            {
                urls: urls ?? ['https://www.google.com'],
                active: active ?? true
            }
        );

        this.windows.set(window.id, window);
        window.setApplicationMenu();

        if (active) {
            window.browserWindow.once('ready-to-show', () => {
                this.selectedId = window.id;
                window.browserWindow.show();
            });
        }

        return window;
    }

    public remove(id: number = this.selectedId) {
        const window = this.windows.get(id);
        // const windowIndex = [...this.windows.keys()].findIndex((window) => window === id);
        // const windows = [...this.windows.values()];

        this.windows.delete(id);

        if (window && !window.browserWindow.isDestroyed()) {
            window.viewManager.clear();
            window.browserWindow.close();
            window.browserWindow.destroy();
        }

        const windows = [...this.windows.values()];
        for (const window of windows)
            window.setApplicationMenu();
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
        window.setApplicationMenu();
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
