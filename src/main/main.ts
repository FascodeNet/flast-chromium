import { initialize } from '@electron/remote/main';
import { app, ipcMain, nativeTheme, protocol } from 'electron';
import { stat } from 'fs/promises';
import { isAbsolute } from 'path';
import { APPLICATION_PROTOCOL } from '../constants';
import { IPCChannel } from '../constants/ipc';
import { UserConfig } from '../interfaces/user';
import { getIconsPath } from '../utils/path';
import { IS_DEVELOPMENT, IS_MAC, IS_WINDOWS } from '../utils/process';
import { isURL, prefixHttp } from '../utils/url';
import { IUser } from './interfaces/user';
import { DialogManager } from './manager/dialog';
import { FaviconManager } from './manager/favicon';
import { UserManager } from './manager/user';
import { WindowManager } from './manager/window';

const singleInstance = app.requestSingleInstanceLock();

export class App {

    public userManager = new UserManager();
    public windowManager = new WindowManager();
    public dialogManager = new DialogManager();
    public faviconManager = new FaviconManager();

    public constructor() {
        App.setProtocols();
        App.setTasks();

        if (!singleInstance) {
            app.quit();
            return;
        }

        this.initializeApp();
    }

    private async initializeApp() {
        const users = await this.userManager.loads();

        app.commandLine.appendSwitch('lang', 'ja-JP');

        await app.whenReady();

        initialize();

        const user = users.length < 1 || !this.userManager.lastUserId ? await this.userManager.create() : await this.userManager.get(this.userManager.lastUserId)!!;
        this.userManager.lastUserId = user.id;
        App.setTheme(user.settings.config);

        console.log(process.argv);
        this.windowManager.add(user, !IS_DEVELOPMENT && process.argv.length > 1 ? [process.argv[1]] : undefined);

        app.on('window-all-closed', () => {
            if (!IS_MAC)
                app.quit();
        });

        app.on('activate', () => {
            if (this.windowManager.windows.length > 0) return;

            const lastUserId = this.userManager.lastUserId;
            if (!lastUserId) return;

            const lastUser = this.userManager.get(lastUserId);
            if (!lastUser) return;

            this.windowManager.add(lastUser);
        });

        app.on('browser-window-focus', (e, browserWindow) => {
            const appWindow = this.windowManager.get(browserWindow.id);
            if (!appWindow) return;

            const settings = appWindow.user.settings;
            App.setTheme(settings.config);

            const windows = this.windowManager.getWindows(appWindow.user).filter((window) => window.id !== browserWindow.id);
            windows.forEach((window) => {
                window.tabManager.tabs.forEach((view) => view.setBounds());
                window.webContents.send(IPCChannel.User.UPDATED_SETTINGS(appWindow.user.id), settings.config);
                window.setStyle();
            });
        });

        app.on('second-instance', async (e, argv) => {
            console.log(argv);

            if (!this.userManager.lastUserId) return;

            const lastUser = this.userManager.get(this.userManager.lastUserId);
            if (!lastUser) return;

            const path = argv[argv.length - 1];

            await this.addWindow(lastUser, path);
        });

        nativeTheme.on('updated', () => {
            this.windowManager.windows.filter((window) => !window.isDestroyed).forEach((window) => {
                window.tabManager.get()?.setBounds();
                window.setStyle();
            });
        });


        ipcMain.on('get-webcontents-id', (e) => {
            e.returnValue = e.sender.id;
        });
    }

    public static setTheme(config: UserConfig) {
        nativeTheme.themeSource = config.appearance.color_scheme;
    }


    private async addWindow(user: IUser, path: string) {
        const currentWindow = this.windowManager.get(this.windowManager.lastWindowId);

        if (isAbsolute(path) && (await stat(path)).isFile()) {
            if (IS_DEVELOPMENT) return;

            if (this.windowManager.windows.length < 1 || currentWindow == null) {
                this.windowManager.add(user, [`file:///${path}`]);
            } else {
                currentWindow.tabManager.add(`file:///${path}`);
                currentWindow.browserWindow.show();
            }
        } else if (isURL(path)) {
            if (this.windowManager.windows.length < 1 || currentWindow == null) {
                this.windowManager.add(user, [prefixHttp(path)]);
            } else {
                currentWindow.tabManager.add(prefixHttp(path));
                currentWindow.browserWindow.show();
            }
        } else {
            this.windowManager.add(user);
        }
    }

    private static setProtocols() {
        protocol.registerSchemesAsPrivileged([
            {
                scheme: APPLICATION_PROTOCOL,
                privileges: {
                    standard: true,
                    secure: true,
                    bypassCSP: true,
                    allowServiceWorkers: true,
                    supportFetchAPI: true,
                    corsEnabled: true
                }
            },
            { scheme: 'chrome-extension', privileges: { standard: true, secure: true, bypassCSP: true } }
        ]);
    }

    private static setTasks() {
        if (!IS_WINDOWS) return;

        app.setUserTasks([
            {
                program: process.execPath,
                arguments: '--new-window',
                iconPath: getIconsPath(nativeTheme.shouldUseDarkColors ? 'white' : 'black', 'window_add.ico'),
                iconIndex: 0,
                title: 'New Window',
                description: 'Create a new window'
            },
            {
                program: process.execPath,
                arguments: '--new-incognito-window',
                iconPath: getIconsPath(nativeTheme.shouldUseDarkColors ? 'white' : 'black', 'window_incognito.png'),
                iconIndex: 0,
                title: 'New Incognito Window',
                description: 'Create a new incognito window'
            }
        ]);
    }
}

export const Main = new App();
