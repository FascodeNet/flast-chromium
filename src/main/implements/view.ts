import { BrowserView, ipcMain } from 'electron';
import { IPCChannel } from '../../constants/ipc';
import { WebContentsImpl } from './webcontents';

export class ViewImpl extends WebContentsImpl {

    public readonly browserView: BrowserView;

    public readonly ipcChannel = IPCChannel.View;

    public constructor(view: BrowserView) {
        super(view);
        this.browserView = view;

        this.handleViewIpc();
        this.webContents.once('destroyed', () => this.removeViewIpc());

        this.webContents.setVisualZoomLevelLimits(1, 3);
    }

    public handleViewIpc() {
        ipcMain.handle(this.ipcChannel.BACK(this.id), () => {
            if (this.isDestroyed) return;
            this.back();
        });
        ipcMain.handle(this.ipcChannel.FORWARD(this.id), () => {
            if (this.isDestroyed) return;
            this.forward();
        });
        ipcMain.handle(this.ipcChannel.RELOAD(this.id), (e, ignoringCache: boolean) => {
            if (this.isDestroyed) return;
            this.reload(ignoringCache);
        });
        ipcMain.handle(this.ipcChannel.STOP(this.id), () => {
            if (this.isDestroyed) return;
            this.stop();
        });
        ipcMain.handle(this.ipcChannel.LOAD(this.id), (e, url: string) => {
            if (this.isDestroyed) return;
            this.load(url);
        });

        ipcMain.handle(this.ipcChannel.ZOOM_IN(this.id), () => {
            if (this.isDestroyed) return this.zoomLevel;
            this.zoomIn();
            return this.zoomLevel;
        });
        ipcMain.handle(this.ipcChannel.ZOOM_OUT(this.id), () => {
            if (this.isDestroyed) return this.zoomLevel;
            this.zoomOut();
            return this.zoomLevel;
        });
        ipcMain.handle(this.ipcChannel.ZOOM_RESET(this.id), () => {
            if (this.isDestroyed) return this.zoomLevel;
            this.zoomReset();
            return this.zoomLevel;
        });
    }

    public removeViewIpc() {
        ipcMain.removeHandler(this.ipcChannel.BACK(this.id));
        ipcMain.removeHandler(this.ipcChannel.FORWARD(this.id));
        ipcMain.removeHandler(this.ipcChannel.RELOAD(this.id));
        ipcMain.removeHandler(this.ipcChannel.STOP(this.id));
        ipcMain.removeHandler(this.ipcChannel.LOAD(this.id));

        ipcMain.removeHandler(this.ipcChannel.ZOOM_IN(this.id));
        ipcMain.removeHandler(this.ipcChannel.ZOOM_OUT(this.id));
        ipcMain.removeHandler(this.ipcChannel.ZOOM_RESET(this.id));
    }
}
