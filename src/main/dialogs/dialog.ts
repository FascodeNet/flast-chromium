import { enable } from '@electron/remote/main';
import { BrowserView, BrowserWindow, ipcMain, Rectangle } from 'electron';
import { IPCChannel } from '../../constants/ipc';
import { getBuildPath } from '../../utils/path';
import { IDialog } from '../interfaces/dialog';
import { IUser } from '../interfaces/user';
import { Main } from '../main';

export class Dialog {

    public readonly id: number;

    public readonly browserView: BrowserView;

    public browserWindow: BrowserWindow;

    public readonly user: IUser;

    public readonly name: string;

    public bounds: Rectangle = {
        width: 0,
        height: 0,
        x: 0,
        y: 0
    };

    private listeners = {
        // tslint:disable-next-line:no-empty
        onResize: () => {
        },
        // tslint:disable-next-line:no-empty
        onMove: () => {
        }
    };

    public constructor(user: IUser, window: BrowserWindow, {
        name,
        bounds,
        onWindowBoundsUpdate,
        // tslint:disable-next-line:no-empty
        onHide = () => {
        },
        webPreferences
    }: IDialog) {
        this.browserView = new BrowserView({
            webPreferences: {
                preload: getBuildPath('preloads', 'dialog.js'),
                nodeIntegration: true,
                contextIsolation: false,
                javascript: true,
                sandbox: false,
                session: user.session.session,
                ...webPreferences
            }
        });
        this.id = this.browserView.webContents.id;

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
                onWindowBoundsUpdate(this, 'resize');
            };
            this.listeners.onMove = () => {
                if (this.webContents.isDestroyed()) return;
                onWindowBoundsUpdate(this, 'move');
            };

            window.on('resize', this.listeners.onResize);
            window.on('move', this.listeners.onMove);
        }

        enable(this.browserView.webContents);

        this.setStyle();

        ipcMain.handle(IPCChannel.Dialog.HIDE(this.id), () => onHide(this));
        ipcMain.handle(IPCChannel.Dialog.DESTROY(this.id), () => Main.dialogManager.destroy(this));
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
        const selected = Main.windowManager.get(this.browserWindow.id)?.viewManager.get();
        if (selected)
            this.browserWindow.setTopBrowserView(selected.browserView);
    }

    public destroy() {
        this.hide();
        // @ts-ignore
        this.browserView.webContents.destroy();

        this.browserWindow.off('resize', this.listeners.onResize);
        this.browserWindow.off('move', this.listeners.onMove);
        ipcMain.removeHandler(IPCChannel.Dialog.HIDE(this.id));
        ipcMain.removeHandler(IPCChannel.Dialog.DESTROY(this.id));
    }

    public setStyle() {
        const { color_scheme, theme } = this.user.settings.config.appearance;
        this.webContents.send(
            IPCChannel.User.UPDATED_THEME(this.user.id),
            this.user.type !== 'incognito' ? color_scheme : 'incognito',
            theme
        );
    }
}
