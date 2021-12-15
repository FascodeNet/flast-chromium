import { enable } from '@electron/remote/main';
import { app, BrowserWindow, ipcMain, Menu, nativeImage, nativeTheme } from 'electron';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { AppWindowInitializerOptions } from '../../interfaces/window';
import { APPLICATION_NAME } from '../../utils';
import { IS_DEVELOPMENT, IS_MAC } from '../../utils/process';
import { Main } from '../main';
import { ViewManager } from '../manager/view';
import { getApplicationMenu } from '../menus/app';
import { IUser } from '../user/interfaces';

export class AppWindow {
    public readonly id: number;

    public readonly user: IUser;

    public browserWindow: BrowserWindow;
    private applicationMenu: Menu;

    public viewManager: ViewManager;

    public constructor(user: IUser, { urls = ['https://www.google.com'] }: AppWindowInitializerOptions) {
        this.browserWindow = new BrowserWindow({
            frame: false,
            minWidth: 500,
            minHeight: 450,
            width: 900,
            height: 700,
            titleBarStyle: 'hiddenInset',
            backgroundColor: '#ffffff',
            title: APPLICATION_NAME,
            icon: nativeImage.createFromPath(`${app.getAppPath()}/static/icons/app/icon.png`),
            webPreferences: {
                preload: join(app.getAppPath(), 'build', 'window.js'),
                plugins: true,
                nodeIntegration: true,
                contextIsolation: false,
                javascript: true,
                session: user.session.session
            },
            show: false
        });

        this.id = this.browserWindow.id;

        enable(this.browserWindow.webContents);
        this.setListeners();
        this.setupIpc();

        this.user = user;

        this.viewManager = new ViewManager(this, user.type === 'incognito');
        urls.forEach((url) => this.viewManager.add(url));

        this.applicationMenu = getApplicationMenu(this);
        Menu.setApplicationMenu(this.applicationMenu);
        this.browserWindow.setMenu(this.applicationMenu);

        this.browserWindow.loadFile('build/app.html');
        this.setStyle();

        if (IS_DEVELOPMENT) {
            // 開発モードの場合はデベロッパーツールを開く
            this.browserWindow.webContents.openDevTools({ mode: 'detach' });
        }
    }

    public get webContents() {
        return this.browserWindow.webContents;
    }

    public getTitle() {
        return this.browserWindow.getTitle();
    }

    public getURL() {
        return this.webContents.getURL();
    }


    public setApplicationMenu() {
        if (this.browserWindow.isDestroyed()) return;

        this.applicationMenu = getApplicationMenu(this);
        Menu.setApplicationMenu(this.applicationMenu);
        this.browserWindow.setMenu(this.applicationMenu);
    }

    public close() {
        this.browserWindow.close();
        Main.windowManager.remove(this.id);
    }


    public async setStyle() {
        if (this.user.type === 'incognito') {
            const style = await readFile(
                join(
                    app.getAppPath(),
                    'static',
                    'styles',
                    'incognito.css'
                )
            );
            this.webContents.insertCSS(style.toString('utf-8'), { cssOrigin: 'user' });
        } else {
            const style = await readFile(
                join(
                    app.getAppPath(),
                    'static',
                    'styles',
                    `${nativeTheme.shouldUseDarkColors ? 'dark' : 'light'}.css`
                )
            );
            this.webContents.insertCSS(style.toString('utf-8'), { cssOrigin: 'user' });
        }
    }


    private setViewBounds() {
        const view = this.viewManager.get();
        if (!view) return;
        view.setBounds();
    }


    private setListeners() {
        const onDestroyed = () => {
            this.viewManager.clear();
            Main.windowManager.remove(this.id);
            Main.windowManager.windows.delete(this.id);

            const windows = [...Main.windowManager.windows.values()];
            for (const window of windows)
                window.setApplicationMenu();
        };
        this.browserWindow.webContents.on('destroyed', onDestroyed);
        this.browserWindow.on('closed', onDestroyed);

        this.browserWindow.on('focus', () => {
            if (IS_MAC)
                this.setApplicationMenu();

            Main.windowManager.select(this.id);
            this.setViewBounds();
        });
        this.browserWindow.on('blur', () => {
            Main.windowManager.selectedId = -1;
        });

        this.browserWindow.on('resize', () => this.setViewBounds());
        this.browserWindow.on('enter-full-screen', () => this.setViewBounds());
        this.browserWindow.on('leave-full-screen', () => this.setViewBounds());
        this.browserWindow.on('enter-html-full-screen', () => this.setViewBounds());
        this.browserWindow.on('leave-html-full-screen', () => this.setViewBounds());


        this.browserWindow.webContents.on('did-finish-load', async () => {
            this.setStyle();
        });
    }

    private setupIpc() {
        ipcMain.handle(`window-user-${this.id}`, () => {
            return this.user.id;
        });

        ipcMain.handle(`window-menu-${this.id}`, () => {
            this.applicationMenu.popup({
                window: this.browserWindow,
                x: 8,
                y: 42
            });
        });

        ipcMain.handle(`window-minimized-${this.id}`, () => {
            return this.browserWindow.isMinimized();
        });
        ipcMain.handle(`window-maximized-${this.id}`, () => {
            return this.browserWindow.isMaximized();
        });

        ipcMain.handle(`window-minimize-${this.id}`, () => {
            this.browserWindow.minimize();
        });
        ipcMain.handle(`window-maximize-${this.id}`, () => {
            if (this.browserWindow.isMaximized())
                this.browserWindow.unmaximize();
            else
                this.browserWindow.maximize();
        });
        ipcMain.handle(`window-close-${this.id}`, () => {
            this.close();
        });
    }
}
