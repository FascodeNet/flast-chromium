import { BrowserView, BrowserWindow } from 'electron';
import { ZoomLevel, ZoomLevels } from '../../interfaces/view';

export class WebContentsImpl {

    public readonly id: number;
    private readonly parent: BrowserWindow | BrowserView;

    public constructor(contents: BrowserWindow | BrowserView) {
        this.id = contents instanceof BrowserWindow ? contents.id : contents.webContents.id;
        this.parent = contents;
    }


    public get webContents() {
        return this.parent.webContents;
    }

    public get isDestroyed() {
        return this.parent instanceof BrowserWindow ? this.parent.isDestroyed() : !this.webContents || this.webContents.isDestroyed();
    }


    public get title() {
        return this.webContents.getTitle();
    }

    public get url() {
        return this.webContents.getURL();
    }


    public get isLoading() {
        return this.webContents.isLoadingMainFrame();
    }

    public get canGoBack() {
        return this.webContents.canGoBack();
    }

    public get canGoForward() {
        return this.webContents.canGoForward();
    }


    public back() {
        if (!this.webContents.canGoBack()) return;
        this.webContents.goBack();
    }

    public forward() {
        if (!this.webContents.canGoForward()) return;
        this.webContents.goForward();
    }

    public reload(ignoringCache: boolean = false) {
        if (ignoringCache) {
            this.webContents.reloadIgnoringCache();
        } else {
            this.webContents.reload();
        }
    }

    public stop() {
        this.webContents.stop();
    }

    public load(url: string) {
        this.webContents.loadURL(url);
    }


    public get zoomLevel(): ZoomLevel {
        return this.webContents.getZoomFactor() as ZoomLevel;
    }

    public set zoomLevel(level: ZoomLevel) {
        this.webContents.setZoomFactor(level);
    }

    public zoomIn() {
        const index = this.zoomLevelIndex;
        if (index >= (ZoomLevels.length - 1)) return;
        this.zoomLevel = ZoomLevels[index + 1];
    }

    public zoomOut() {
        const index = this.zoomLevelIndex;
        if (index <= 0) return;
        this.zoomLevel = ZoomLevels[index - 1];
    }

    public zoomReset() {
        this.zoomLevel = 1.00;
    }

    private get zoomLevelIndex() {
        const level = this.zoomLevel;
        const levels = ZoomLevels.map((zoomLevel) => Math.abs(zoomLevel - level));
        const minLevel = Math.min(...levels);
        return levels.indexOf(minLevel);
    }
}
