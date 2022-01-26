import { enable } from '@electron/remote/main';
import { app, BrowserView, BrowserWindow, ipcMain, Rectangle } from 'electron';
import { join } from 'path';
import { IDialog } from '../interfaces/dialog';
import { IUser } from '../interfaces/user';
import { Main } from '../main';

export class Dialog {

    public readonly user: IUser;

    public browserWindow: BrowserWindow;
    public readonly browserView: BrowserView;

    public readonly name: string;

    public bounds: Rectangle = {
        width: 0,
        height: 0,
        x: 0,
        y: 0
    };

    private listeners = {
        onResize: () => {
        },
        onMove: () => {
        }
    };

    public constructor(user: IUser, window: BrowserWindow, {
        name,
        bounds,
        onWindowBoundsUpdate,
        onHide = () => {
        },
        webPreferences
    }: IDialog) {
        this.browserView = new BrowserView({
            webPreferences: {
                preload: join(app.getAppPath(), 'build', 'dialog.js'),
                nodeIntegration: true,
                contextIsolation: false,
                javascript: true,
                session: user.session.session,
                ...webPreferences
            }
        });

        this.user = user;

        this.browserWindow = window;

        this.bounds = { ...this.bounds, ...bounds };
        const { height } = window.getContentBounds();
        if ((this.bounds.height + this.bounds.y) >= height)
            this.bounds.height = height - this.bounds.y;

        this.name = name;

        if (onWindowBoundsUpdate) {
            this.listeners.onResize = () => {
                if (this.webContents.isDestroyed()) return;
                onWindowBoundsUpdate('resize');
            };
            this.listeners.onMove = () => {
                if (this.webContents.isDestroyed()) return;
                onWindowBoundsUpdate('move');
            };

            window.on('resize', this.listeners.onResize);
            window.on('move', this.listeners.onMove);
        }

        enable(this.browserView.webContents);
        this.setStyle();

        ipcMain.handle(`dialog-hide-${this.browserView.webContents.id}`, onHide);
        ipcMain.handle(
            `dialog-destroy-${this.browserView.webContents.id}`,
            () => Main.dialogManager.destroy(this)
        );
    }

    public get webContents() {
        return this.browserView.webContents;
    }

    public show() {
        if (this.webContents.isDestroyed()) return;

        this.browserWindow.addBrowserView(this.browserView);
        this.browserWindow.setTopBrowserView(this.browserView);
        this.browserView.setBounds(this.bounds);
        this.browserView.webContents.focus();
    }

    public hide() {
        if (this.webContents.isDestroyed()) return;

        this.browserWindow.removeBrowserView(this.browserView);
        this.browserWindow.setTopBrowserView(this.browserWindow.getBrowserViews()[0]);
    }

    public destroy() {
        this.hide();
        // @ts-ignore
        this.browserView.webContents.destroy();

        this.browserWindow.off('resize', this.listeners.onResize);
        this.browserWindow.off('move', this.listeners.onMove);
        ipcMain.removeHandler(`dialog-hide-${this.browserView.webContents.id}`);
        ipcMain.removeHandler(`dialog-destroy-${this.browserView.webContents.id}`);
    }


    public async setStyle() {
        this.webContents.send('theme-update');

        /*
        const currentInjectedThemeStyleKey = this._injectedThemeStyleKey;
        if (this.user.type === 'incognito') {
            const style = await readFile(
                join(
                    app.getAppPath(),
                    'static',
                    'styles',
                    'incognito.css'
                )
            );
            this._injectedThemeStyleKey = await this.webContents.insertCSS(style.toString('utf-8'), { cssOrigin: 'user' });
        } else {
            const style = await readFile(
                join(
                    app.getAppPath(),
                    'static',
                    'styles',
                    `${nativeTheme.shouldUseDarkColors ? 'dark' : 'light'}.css`
                )
            );
            this._injectedThemeStyleKey = await this.webContents.insertCSS(style.toString('utf-8'), { cssOrigin: 'user' });
        }

        if (currentInjectedThemeStyleKey)
            await this.webContents.removeInsertedCSS(currentInjectedThemeStyleKey);
        */
    }
}
