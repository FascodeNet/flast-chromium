import { enable } from '@electron/remote/main';
import { BrowserWindow, ipcMain } from 'electron';
import { IPCChannel } from '../../constants/ipc';
import { WebContentsImpl } from './webcontents';

export class WindowImpl extends WebContentsImpl {

    public readonly browserWindow: BrowserWindow;

    private readonly ipcChannel = IPCChannel.Window;

    public constructor(window: BrowserWindow) {
        super(window);
        this.browserWindow = window;

        enable(window.webContents);

        this.handleWindowIpc();
        this.browserWindow.once('closed', () => this.removeWindowIpc());
    }


    public get title(): string {
        return this.browserWindow.getTitle();
    }


    public handleWindowIpc() {
        ipcMain.handle(this.ipcChannel.IS_MINIMIZED(this.id), () => {
            return this.browserWindow.isMinimized();
        });
        ipcMain.handle(this.ipcChannel.IS_MAXIMIZED(this.id), () => {
            return this.browserWindow.isMaximized();
        });
        ipcMain.handle(this.ipcChannel.IS_FULLSCREEN(this.id), () => {
            return this.browserWindow.isFullScreen();
        });

        ipcMain.handle(this.ipcChannel.MINIMIZE(this.id), () => {
            this.browserWindow.minimize();
        });
        ipcMain.handle(this.ipcChannel.MAXIMIZE(this.id), () => {
            if (this.browserWindow.isMaximized())
                this.browserWindow.unmaximize();
            else
                this.browserWindow.maximize();
        });
        ipcMain.handle(this.ipcChannel.FULLSCREEN(this.id), () => {
            this.browserWindow.setFullScreen(!this.browserWindow.isFullScreen());
        });
    }

    public removeWindowIpc() {
        ipcMain.removeHandler(this.ipcChannel.IS_MINIMIZED(this.id));
        ipcMain.removeHandler(this.ipcChannel.IS_MAXIMIZED(this.id));
        ipcMain.removeHandler(this.ipcChannel.IS_FULLSCREEN(this.id));

        ipcMain.removeHandler(this.ipcChannel.MINIMIZE(this.id));
        ipcMain.removeHandler(this.ipcChannel.MAXIMIZE(this.id));
        ipcMain.removeHandler(this.ipcChannel.FULLSCREEN(this.id));

        ipcMain.removeHandler(this.ipcChannel.CLOSE(this.id));
    }
}
