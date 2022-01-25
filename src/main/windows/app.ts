import { enable } from '@electron/remote/main';
import deepmerge from 'deepmerge';
import { app, BrowserWindow, ipcMain, Menu, nativeImage } from 'electron';
import { join } from 'path';
import { WindowFullScreenState } from '../../interfaces/window';
import { APPLICATION_NAME } from '../../utils';
import { isHorizontal } from '../../utils/design';
import { IS_DEVELOPMENT } from '../../utils/process';
import { showExtensionsDialog } from '../dialogs/extensions';
import { showHistoriesDialog } from '../dialogs/histories';
import { IUser } from '../interfaces/user';
import { AppWindowInitializerOptions } from '../interfaces/window';
import { Main } from '../main';
import { ViewManager } from '../manager/view';
import { getApplicationMenu } from '../menus/app';
import { getExtensionMenu } from '../menus/extension';
import { getWindowMenu } from '../menus/window';

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
            titleBarStyle: 'hidden',
            trafficLightPosition: {
                x: 17,
                y: 17
            },
            backgroundColor: '#ffffffff',
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

        this._fullScreenState = {
            user: this.browserWindow.isFullScreen(),
            html: false
        };

        this.viewManager = new ViewManager(this, user.type === 'incognito');
        urls.forEach((url) => this.viewManager.add(url));

        this.applicationMenu = getWindowMenu(this);
        Menu.setApplicationMenu(this.applicationMenu);
        this.browserWindow.setMenu(this.applicationMenu);

        this.browserWindow.loadFile(join(app.getAppPath(), 'build', 'browser', 'app.html'));
        this.setStyle();

        this.webContents.once('dom-ready', () => {
            if (!IS_DEVELOPMENT) return;

            // 開発モードの場合はデベロッパーツールを開く
            this.browserWindow.webContents.openDevTools({ mode: 'detach' });
        });
    }

    private _fullScreenState: WindowFullScreenState;

    public get webContents() {
        return this.browserWindow.webContents;
    }

    public getTitle() {
        return this.browserWindow.getTitle();
    }

    public getURL() {
        return this.webContents.getURL();
    }

    public get fullScreenState() {
        return this._fullScreenState;
    }


    public setApplicationMenu() {
        if (this.browserWindow.isDestroyed()) return;

        this.applicationMenu = getWindowMenu(this);
        Menu.setApplicationMenu(this.applicationMenu);
        this.browserWindow.setMenu(this.applicationMenu);
    }

    public close() {
        this.browserWindow.close();
        Main.windowManager.remove(this.id);
    }


    public async setStyle() {
        this.webContents.send('theme-update');
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

            Menu.setApplicationMenu(getApplicationMenu(this.user));
        };
        this.browserWindow.webContents.on('destroyed', onDestroyed);
        this.browserWindow.on('closed', onDestroyed);

        this.browserWindow.on('focus', () => {
            this.setApplicationMenu();

            Main.windowManager.selectedId = this.id;
            Main.windowManager.lastWindowId = this.id;

            Main.windowManager.select(this.id);
            this.setViewBounds();
        });
        this.browserWindow.on('blur', () => {
            Main.windowManager.selectedId = -1;
        });

        this.browserWindow.on('resize', () => this.setViewBounds());
        this.browserWindow.on('enter-full-screen', () => {
            console.log('enter-full-screen');
            this._fullScreenState = deepmerge<WindowFullScreenState>(this._fullScreenState, { user: true });
            this.setApplicationMenu();
            this.setViewBounds();
        });
        this.browserWindow.on('leave-full-screen', () => {
            console.log('leave-full-screen');
            this._fullScreenState = deepmerge<WindowFullScreenState>(this._fullScreenState, { user: false });
            this.setApplicationMenu();
            this.setViewBounds();
        });
        this.browserWindow.on('enter-html-full-screen', () => {
            console.log('enter-html-full-screen');
            this._fullScreenState = deepmerge<WindowFullScreenState>(this._fullScreenState, { html: true });
            this.setViewBounds();
        });
        this.browserWindow.on('leave-html-full-screen', () => {
            console.log('leave-html-full-screen');
            this._fullScreenState = deepmerge<WindowFullScreenState>(this._fullScreenState, { html: false });
            this.setViewBounds();
        });


        this.browserWindow.webContents.on('did-finish-load', async () => {
            this.setStyle();
        });
    }

    private setupIpc() {
        ipcMain.handle(`window-user-${this.id}`, () => {
            return this.user.id;
        });

        ipcMain.handle(`window-menu-${this.id}`, () => {
            const settings = this.user.settings;

            this.applicationMenu.popup({
                window: this.browserWindow,
                x: settings.config.appearance.style !== 'top_double' ? 8 : 0,
                y: settings.config.appearance.style !== 'top_double' ? 42 : 36
            });
        });
        ipcMain.handle(`window-sidebar-${this.id}`, () => {
            const settings = this.user.settings;
            if (isHorizontal(settings.config.appearance.style)) return;

            settings.config = { appearance: { sidebar: { extended: !settings.config.appearance.sidebar.extended } } };

            const windows = Main.windowManager.getWindows().filter((appWindow) => appWindow.user.id === this.user.id);
            windows.forEach((window) => {
                window.webContents.send('settings-update', settings.config);
                window.viewManager.get()?.setBounds();
            });
        });

        ipcMain.handle(`window-minimized-${this.id}`, () => {
            return this.browserWindow.isMinimized();
        });
        ipcMain.handle(`window-maximized-${this.id}`, () => {
            return this.browserWindow.isMaximized();
        });
        ipcMain.handle(`window-fullscreened-${this.id}`, () => {
            return this.browserWindow.isFullScreen();
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
        ipcMain.handle(`window-fullscreen-${this.id}`, () => {
            this.browserWindow.setFullScreen(!this.browserWindow.isFullScreen());
        });
        ipcMain.handle(`window-close-${this.id}`, () => {
            this.close();
        });

        ipcMain.handle(`window-find-${this.id}`, () => {
            const view = this.viewManager.get();
            if (!view) return;

            view.findInPage(null);
        });

        ipcMain.handle(`window-bookmarks-${this.id}`, (e, x: number, y: number) => {
            showHistoriesDialog(this.user, this.browserWindow, x, y);
        });

        ipcMain.handle(`window-histories-${this.id}`, (e, x: number, y: number) => {
            showHistoriesDialog(this.user, this.browserWindow, x, y);
        });

        ipcMain.handle(`window-extensions-${this.id}`, (e, x: number, y: number) => {
            showExtensionsDialog(this.user, this.browserWindow, x, y);
        });
        ipcMain.handle(`extension-menu-${this.id}`, (e, id: string, x: number, y: number) => {
            const extension = this.webContents.session.getExtension(id);
            if (!extension) return;

            const menu = getExtensionMenu(extension, this);
            if (e.sender.getType() === 'browserView') {
                const dialog = Main.dialogManager.getDynamic('extensions');
                if (!dialog) return;

                menu.popup({
                    window: this.browserWindow,
                    x: dialog.bounds.x + x,
                    y: dialog.bounds.y + y
                });
            } else {
                menu.popup({
                    window: this.browserWindow,
                    x, y
                });
            }
        });
    }
}
