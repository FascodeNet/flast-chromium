import { initialize } from '@electron/remote/main';
import { app, ipcMain, nativeTheme, protocol } from 'electron';
import { stat } from 'fs/promises';
import { isAbsolute } from 'path';
import { UserConfig } from '../interfaces/user';
import { APPLICATION_PROTOCOL } from '../utils';
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

        console.log(process.argv);
        const urls = !IS_DEVELOPMENT && process.argv.length > 1 ? [process.argv[1]] : ['https://www.google.com'];

        const user = users.length < 1 || !this.userManager.lastUserId ? await this.userManager.create() : await this.userManager.get(this.userManager.lastUserId)!!;
        this.userManager.lastUserId = user.id;
        App.setTheme(user.settings.config);
        this.windowManager.add(user, urls);


        app.on('window-all-closed', () => {
            if (!IS_MAC)
                app.quit();
        });

        app.on('activate', () => {
            if (this.windowManager.getWindows().length > 0) return;

            const lastUserId = this.userManager.lastUserId;
            if (!lastUserId) return;

            const user = this.userManager.get(lastUserId);
            if (!user) return;

            this.windowManager.add(user);
        });

        app.on('browser-window-focus', (e, browserWindow) => {
            const window = this.windowManager.get(browserWindow.id);
            if (!window) return;

            const settings = window.user.settings;
            App.setTheme(settings.config);

            const windows = this.windowManager.getWindows().filter((appWindow) => appWindow.user.id === window.user.id && appWindow.id !== browserWindow.id);
            windows.forEach((window) => {
                window.webContents.send('settings-update', settings.config);
                window.viewManager.get()?.setBounds();
                window.setStyle();
            });
        });

        app.on('second-instance', async (e, argv) => {
            console.log(argv);

            if (!this.userManager.lastUserId) return;

            const user = this.userManager.get(this.userManager.lastUserId);
            if (!user) return;

            const path = argv[argv.length - 1];

            await this.addWindow(user, path);
        });

        nativeTheme.on('updated', () => {
            this.windowManager.getWindows().forEach((window) => {
                window.viewManager.get()?.setBounds();
                window.setStyle();
            });
        });


        ipcMain.on('get-webcontents-id', (e) => {
            e.returnValue = e.sender.id;
        });
    }

    public static setTheme(config: UserConfig) {
        nativeTheme.themeSource = config.appearance.mode;
    }


    private async addWindow(user: IUser, path: string) {
        const currentWindow = this.windowManager.get(this.windowManager.lastWindowId);

        if (isAbsolute(path) && (await stat(path)).isFile()) {
            if (IS_DEVELOPMENT) return;

            if (this.windowManager.getWindows().length < 1 || currentWindow == null) {
                this.windowManager.add(user, [`file:///${path}`]);
            } else {
                currentWindow.viewManager.add(`file:///${path}`);
                currentWindow.browserWindow.show();
            }
        } else if (isURL(path)) {
            if (this.windowManager.getWindows().length < 1 || currentWindow == null) {
                this.windowManager.add(user, [prefixHttp(path)]);
            } else {
                currentWindow.viewManager.add(prefixHttp(path));
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
                    supportFetchAPI: true,
                    allowServiceWorkers: true,
                    corsEnabled: false
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
                iconPath: `${app.getAppPath()}/static/icons/${nativeTheme.shouldUseDarkColors ? 'white' : 'black'}/window_add.ico`,
                iconIndex: 0,
                title: 'New Window',
                description: 'Create a new window'
            },
            {
                program: process.execPath,
                arguments: '--new-incognito-window',
                iconPath: `${app.getAppPath()}/static/icons/${nativeTheme.shouldUseDarkColors ? 'white' : 'black'}/window_incognito.png`,
                iconIndex: 0,
                title: 'New Incognito Window',
                description: 'Create a new incognito window'
            }
        ]);
    }
}

export const Main = new App();
