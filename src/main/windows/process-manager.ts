import { enable } from '@electron/remote/main';
import { app, BrowserWindow, ipcMain, nativeImage } from 'electron';
import { IS_DEVELOPMENT } from '../../utils/process';

export class ProcessManagerWindow {
    public readonly id: number;

    public browserWindow: BrowserWindow;

    public constructor() {
        this.browserWindow = new BrowserWindow({
            frame: false,
            minWidth: 500,
            minHeight: 450,
            width: 600,
            height: 550,
            titleBarStyle: 'hiddenInset',
            backgroundColor: '#ffffff',
            title: 'Process Manager',
            icon: nativeImage.createFromPath(`${app.getAppPath()}/static/icons/app/icon.png`),
            webPreferences: {
                // preload: join(app.getAppPath(), 'build', 'window.js'),
                plugins: true,
                nodeIntegration: true,
                contextIsolation: false,
                javascript: true
            },
            show: false
        });

        this.id = this.browserWindow.id;

        enable(this.browserWindow.webContents);
        this.setListeners();
        this.setupIpc();

        this.browserWindow.setMenu(null);

        this.browserWindow.loadFile('build/process-manager.html');

        if (IS_DEVELOPMENT) {
            this.browserWindow.removeMenu();
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


    private setListeners() {

    }

    private setupIpc() {
        ipcMain.handle(`window-minimize-${this.id}`, (e, options) => {
            this.browserWindow.minimize();
        });
        ipcMain.handle(`window-maximize-${this.id}`, (e, options) => {
            if (this.browserWindow.isMaximized())
                this.browserWindow.unmaximize();
            else
                this.browserWindow.maximize();
        });
        ipcMain.handle(`window-close-${this.id}`, (e) => {
            this.browserWindow.close();
        });
    }
}
