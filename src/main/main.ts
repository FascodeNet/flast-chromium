import { initialize } from '@electron/remote/main';
import { app, dialog, ipcMain, nativeTheme, protocol } from 'electron';
import { stat } from 'fs/promises';
import { extname, isAbsolute } from 'path';
import { UserConfig } from '../interfaces/user';
import { APPLICATION_PROTOCOL } from '../utils';
import { IS_DEVELOPMENT, IS_MAC, IS_WINDOWS } from '../utils/process';
import { isURL, prefixHttp } from '../utils/url';
import { DialogManager } from './manager/dialog';
import { FaviconManager } from './manager/favicon';
import { UserManager } from './manager/user';
import { WindowManager } from './manager/window';

/*
export const userManager = new UserManager();
export const windowManager = new WindowManager();
export const faviconManager = new FaviconManager();
*/


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

        await app.whenReady();

        initialize();

        if (users.length < 1 || !this.userManager.lastUserId) {
            const user = await this.userManager.create();
            this.userManager.lastUserId = user.id;
            App.setTheme(user.settings.config);
            this.windowManager.add(user);
        } else {
            const user = this.userManager.get(this.userManager.lastUserId)!!;
            App.setTheme(user.settings.config);
            this.windowManager.add(user);
        }


        app.once('window-all-closed', () => {
            if (!IS_MAC)
                app.quit();
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
            dialog.showMessageBox({ message: argv.toString() });

            if (!this.userManager.lastUserId) return;

            const user = this.userManager.get(this.userManager.lastUserId);
            if (!user) return;

            const currentWindow = this.windowManager.get();

            const path = argv[argv.length - 1];

            if (isAbsolute(path) && (await stat(path)).isFile()) {
                if (IS_DEVELOPMENT) return;

                const ext = extname(path);
                if (ext !== '.html' && ext !== '.htm') return;

                if (this.windowManager.getWindows().length < 1 || currentWindow == null) {
                    this.windowManager.add(user, [`file:///${path}`], false);
                } else {
                    currentWindow.viewManager.add(`file:///${path}`, false);
                    currentWindow.browserWindow.show();
                }
            } else if (isURL(path)) {
                if (this.windowManager.getWindows().length < 1 || currentWindow == null) {
                    this.windowManager.add(user, [prefixHttp(path)], false);
                } else {
                    currentWindow.viewManager.add(prefixHttp(path), false);
                    currentWindow.browserWindow.show();
                }
            } else {
                this.windowManager.add(user);
            }
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

/*
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

app.setUserTasks([
    {
        program: process.execPath,
        arguments: '--new-window',
        iconPath: `${app.getAppPath()}/static/icons/${nativeTheme.shouldUseDarkColors ? 'white' : 'black'}/window_add.png`,
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

app.whenReady().then(async () => {
    initialize();

    const users = await userManager.loads();

    if (users.length < 1 || !userManager.lastUserId) {
        const user = await userManager.create();
        userManager.lastUserId = user.id;
        windowManager.add(user);
    } else {
        const user = userManager.get(userManager.lastUserId)!!;
        windowManager.add(user);
    }
});

app.once('window-all-closed', () => {
    if (!IS_MAC)
        app.quit();
});

app.on('browser-window-focus', (e, browserWindow) => {
    const window = windowManager.get(browserWindow.id);
    if (!window) return;

    const settings = window.user.settings;
    nativeTheme.themeSource = settings.config.appearance.mode;

    const windows = windowManager.getWindows().filter((appWindow) => appWindow.user.id === window.user.id && appWindow.id !== browserWindow.id);
    windows.forEach((window) => {
        window.webContents.send('settings-update', settings.config);
        window.viewManager.get()?.setBounds();
    });
});

ipcMain.on('get-webcontents-id', (e) => {
    e.returnValue = e.sender.id;
});
*/

export const Main = new App();
