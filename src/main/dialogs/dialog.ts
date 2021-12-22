import { enable } from '@electron/remote/main';
import { app, BrowserView, BrowserWindow, ipcMain, Rectangle } from 'electron';
import { join } from 'path';
import { IDialog } from '../interfaces/dialog';

export class Dialog {

    public browserWindow: BrowserWindow;
    public readonly browserView: BrowserView;

    public readonly name: string;

    public bounds: Rectangle = {
        width: 0,
        height: 0,
        x: 0,
        y: 0
    };

    public constructor(window: BrowserWindow, { name, bounds, onWindowBoundsUpdate, webPreferences }: IDialog) {
        this.browserView = new BrowserView({
            webPreferences: {
                preload: join(app.getAppPath(), 'build', 'dialog.js'),
                nodeIntegration: true,
                contextIsolation: false,
                javascript: true,
                ...webPreferences
            }
        });

        this.browserWindow = window;

        this.bounds = { ...this.bounds, ...bounds };

        this.name = name;

        if (onWindowBoundsUpdate) {
            window.on('resize', () => onWindowBoundsUpdate('resize'));
            window.on('move', () => onWindowBoundsUpdate('move'));
        }

        enable(this.browserView.webContents);

        ipcMain.handle(`dialog-hide-${this.browserView.webContents.id}`, () => this.hide());
    }

    public show() {
        this.browserWindow.addBrowserView(this.browserView);
        this.browserWindow.setTopBrowserView(this.browserView);
        this.browserView.setBounds(this.bounds);
        this.browserView.webContents.focus();
    }

    public hide() {
        this.browserWindow.removeBrowserView(this.browserView);
        this.browserWindow.setTopBrowserView(this.browserWindow.getBrowserViews()[0]);
    }

    public destroy() {
        this.hide();
        // @ts-ignore
        this.browserView.webContents.destroy();
    }
}
