import { enable } from '@electron/remote/main';
import { app, BrowserWindow, ipcMain, Menu, nativeImage } from 'electron';
import { join } from 'path';
import { isHorizontal } from '../../interfaces/user';
import { APPLICATION_NAME } from '../../utils';
import { IS_DEVELOPMENT, IS_MAC } from '../../utils/process';
import { showHistoriesDialog } from '../dialogs/histories';
import { IUser } from '../interfaces/user';
import { AppWindowInitializerOptions } from '../interfaces/window';
import { Main } from '../main';
import { ViewManager } from '../manager/view';
import { getApplicationMenu } from '../menus/app';

export class AppWindow {
    public readonly id: number;

    public readonly user: IUser;

    public browserWindow: BrowserWindow;
    private applicationMenu: Menu;

    public viewManager: ViewManager;

    private _injectedModeStyleKey?: string = undefined;
    private _injectedThemeStyleKey?: string = undefined;

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

        this.browserWindow.loadFile(join(app.getAppPath(), 'build', 'app.html'));
        this.setStyle();

        this.webContents.once('dom-ready', () => {
            if (!IS_DEVELOPMENT) return;

            // 開発モードの場合はデベロッパーツールを開く
            this.browserWindow.webContents.openDevTools({ mode: 'detach' });
        });
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
        this.webContents.send('theme-update');

        /*
        const currentInjectedModeStyleKey = this._injectedModeStyleKey;
        if (this.user.type === 'incognito') {
            const style = await readFile(
                join(
                    app.getAppPath(),
                    'static',
                    'styles',
                    'incognito.css'
                )
            );
            this._injectedModeStyleKey = await this.webContents.insertCSS(style.toString('utf-8'));
        } else {
            const modeStyle = await readFile(
                join(
                    app.getAppPath(),
                    'static',
                    'styles',
                    `${nativeTheme.shouldUseDarkColors ? 'dark' : 'light'}.css`
                )
            );
            this._injectedModeStyleKey = await this.webContents.insertCSS(modeStyle.toString('utf-8'));

            const isInternalTheme = (theme: AppearanceTheme): theme is AppearanceInternalTheme => {
                return true;
            };


            const currentInjectedThemeStyleKey = this._injectedThemeStyleKey;
            const theme = this.user.settings.config.appearance.theme;
            if (theme) {
                const themeStyle = await readFile(
                    isInternalTheme(theme) ? join(
                        app.getAppPath(),
                        'static',
                        'styles',
                        `${theme}.css`
                    ) : join(
                        app.getPath('userData'),
                        'theme.css'
                    )
                );

                console.log(currentInjectedThemeStyleKey);
                this._injectedThemeStyleKey = await this.webContents.insertCSS(themeStyle.toString('utf-8'));
                console.log(currentInjectedThemeStyleKey);
            }

            console.log(currentInjectedThemeStyleKey);
            if (currentInjectedThemeStyleKey)
                await this.webContents.removeInsertedCSS(currentInjectedThemeStyleKey);
        }

        if (currentInjectedModeStyleKey)
            await this.webContents.removeInsertedCSS(currentInjectedModeStyleKey);
        */
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

            Main.windowManager.selectedId = this.id;
            Main.windowManager.lastWindowId = this.id;

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

        ipcMain.handle(`window-histories-${this.id}`, (e, x: number, y: number) => {
            showHistoriesDialog(this.user, this.browserWindow, x, y);
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
