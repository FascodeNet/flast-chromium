import { app, BrowserView } from 'electron';
/// <reference types="../../@types/image-data-uri" />
// @ts-ignore
import { encodeFromURL } from 'image-data-uri';
import { join } from 'path';
import {
    WINDOW_EXTENDED_SIDEBAR_WIDTH,
    WINDOW_EXTENDED_TAB_CONTAINER_WIDTH,
    WINDOW_TITLE_BAR_HEIGHT,
    WINDOW_TOOL_BAR_HEIGHT
} from '../../constants/design';
import { AppViewInitializerOptions, MediaStatus, ViewState, ZoomLevel, ZoomLevels } from '../../interfaces/view';
import { APPLICATION_NAME } from '../../utils';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { FaviconManager } from '../manager/favicon';
import { getContextMenu } from '../menus/view';
import { AppWindow } from '../windows/app';

export class AppView {
    public readonly id: number;

    public browserView: BrowserView;

    public window: AppWindow;

    private favicon?: string;
    private color?: string;

    private mediaStatus: MediaStatus = 'none';
    private pinned: boolean = false;

    public incognito: boolean = false;

    public readonly user: IUser;

    public constructor(window: AppWindow, { url, incognito = false }: AppViewInitializerOptions) {
        const userSession = window.user.session;

        this.browserView = new BrowserView({
            webPreferences: {
                preload: join(app.getAppPath(), 'build', 'view.js'),
                nodeIntegration: false,
                contextIsolation: true,
                javascript: true,
                plugins: false,
                experimentalFeatures: false,
                sandbox: false,
                safeDialogs: true,
                safeDialogsMessage: '今後このページではダイアログを表示しない',
                session: userSession.session
            }
        });

        this.window = window;
        // this.setBounds();

        this.user = window.user;

        this.id = this.browserView.webContents.id;
        this.incognito = incognito;

        const webContents = this.webContents;

        if (window.user.type === 'normal')
            userSession.extensions.addTab(this.browserView.webContents, window.browserWindow);

        this.setListeners();
        webContents.setWindowOpenHandler(({ url, frameName, disposition }) => {
            if (disposition === 'new-window') {
                if (frameName === '_self') {
                    webContents.loadURL(url);
                } else {
                    this.window.viewManager.add(url);
                }
            } else if (disposition === 'foreground-tab') {
                this.window.viewManager.add(url);
            } else if (disposition === 'background-tab') {
                this.window.viewManager.add(url, false);
            }

            return { action: 'deny' };
        });

        webContents.setVisualZoomLevelLimits(1, 3);
        webContents.loadURL(url);
    }

    public get webContents() {
        return this.browserView.webContents;
    }

    public isLoading() {
        return this.webContents.isLoadingMainFrame();
    }

    public canGoBack() {
        return this.webContents.canGoBack();
    }

    public canGoForward() {
        return this.webContents.canGoForward();
    }

    public getTitle() {
        return this.webContents.getTitle();
    }

    public getURL() {
        return this.webContents.getURL();
    }

    public getFavicon() {
        return this.favicon;
    }

    public getColor() {
        return this.color;
    }

    public getMediaStatus() {
        return this.mediaStatus;
    }

    public isMuted() {
        return this.webContents.isAudioMuted();
    }

    public setMuted(muted: boolean) {
        this.webContents.setAudioMuted(muted);
        this.updateView();
    }

    public isPinned() {
        return this.pinned;
    }

    public setPinned(pinned: boolean) {
        this.pinned = pinned;
        this.updateView();
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


    public getZoomLevel(): ZoomLevel {
        return this.webContents.getZoomFactor() as ZoomLevel;
    }

    public setZoomLevel(level: ZoomLevel) {
        this.webContents.setZoomFactor(level);
    }

    public zoomIn() {
        const index = this.getZoomLevelIndex();
        if (index >= (ZoomLevels.length - 1)) return;
        this.setZoomLevel(ZoomLevels[index + 1]);
    }

    public zoomOut() {
        const index = this.getZoomLevelIndex();
        if (index <= 0) return;
        this.setZoomLevel(ZoomLevels[index - 1]);
    }

    public zoomReset() {
        this.setZoomLevel(1.00);
    }

    private getZoomLevelIndex() {
        const level = this.getZoomLevel();
        const levels = ZoomLevels.map((zoomLevel) => Math.abs(zoomLevel - level));
        const minLevel = Math.min(...levels);
        return levels.indexOf(minLevel);
    }


    public setWindowTitle() {
        if (this.window.viewManager.selectedId !== this.id) return;
        this.window.browserWindow.setTitle(`${this.getTitle()} - ${APPLICATION_NAME}`);
    }

    public setBounds() {
        if (this.window.viewManager.selectedId !== this.id) return;

        const { width, height } = this.window.browserWindow.getContentBounds();
        const isFullScreen = this.window.browserWindow.isFullScreen();
        const isMaximized = this.window.browserWindow.isMaximized();

        this.browserView.setAutoResize({ width: true, height: true });

        const { style, sidebar: { extended, state } } = this.user.settings.config.appearance;

        const sidebarWidth = extended ? (state !== 'tab_container' ? WINDOW_EXTENDED_SIDEBAR_WIDTH : WINDOW_EXTENDED_TAB_CONTAINER_WIDTH) : 50;

        const baseWidth = isFullScreen || isMaximized ? width : width - 2;
        const baseHeight = isFullScreen ? height : ((isMaximized ? height : height - 1) - 50);
        const baseX = isFullScreen || isMaximized ? 0 : 1;
        const baseY = isFullScreen ? 0 : 50;

        const verticalWidth = isFullScreen ? width : (isMaximized ? width - sidebarWidth : width - 1 - sidebarWidth);

        switch (style) {
            case 'top_single':
                this.browserView.setBounds({
                    width: baseWidth,
                    height: baseHeight,
                    x: baseX,
                    y: baseY
                });
                break;
            case 'top_double':
                this.browserView.setBounds({
                    width: baseWidth,
                    height: isFullScreen ? height : ((isMaximized ? height : height - 1) - (WINDOW_TITLE_BAR_HEIGHT + WINDOW_TOOL_BAR_HEIGHT)),
                    x: baseX,
                    y: isFullScreen ? 0 : WINDOW_TITLE_BAR_HEIGHT + WINDOW_TOOL_BAR_HEIGHT
                });
                break;
            case 'left':
                this.browserView.setBounds({
                    width: verticalWidth,
                    height: baseHeight,
                    x: isFullScreen ? 0 : sidebarWidth,
                    y: baseY
                });
                break;
            case 'right':
                this.browserView.setBounds({
                    width: verticalWidth,
                    height: baseHeight,
                    x: baseX,
                    y: baseY
                });
                break;
            default:
                this.browserView.setBounds({
                    width: baseWidth,
                    height: baseHeight,
                    x: baseX,
                    y: baseY
                });
                break;
        }

        this.window.browserWindow.addBrowserView(this.browserView);
        this.window.browserWindow.setTopBrowserView(this.browserView);
    }

    public getState(): ViewState {
        return {
            id: this.id,
            title: this.getTitle(),
            url: this.getURL(),
            favicon: this.getFavicon(),
            color: this.getColor(),

            isLoading: this.isLoading(),
            canGoBack: this.canGoBack(),
            canGoForward: this.canGoForward(),

            media: this.getMediaStatus(),
            isPinned: this.isPinned()
        };
    }


    private setListeners() {
        const webContents = this.webContents;
        webContents.on('destroyed', () => {
            const viewManager = this.window.viewManager;
            viewManager.views.delete(this.id);
            viewManager.sortOrders = viewManager.sortOrders.filter((sortId) => sortId !== this.id);
        });

        webContents.on('did-start-loading', async () => {
            const faviconUrl = FaviconManager.toUrl(this.getURL());
            if (faviconUrl)
                this.favicon = (await Main.faviconManager.get(faviconUrl))?.favicon;

            this.updateView();
        });
        webContents.on('did-stop-loading', () => {
            this.updateView();
        });
        webContents.on('did-finish-load', () => {
            this.updateView();
        });
        webContents.on('did-frame-finish-load', (e, isMainFrame) => {
            if (!isMainFrame) return;

            this.updateView();

            if (!this.isLoading())
                this.user.histories.add({ title: this.getTitle(), url: this.getURL(), favicon: this.getFavicon() });
        });
        webContents.on('did-fail-load', () => {
            this.updateView();
        });

        webContents.on('page-title-updated', (_, title) => {
            this.updateView();

            if (!this.isLoading())
                this.user.histories.add({ title, url: this.getURL(), favicon: this.getFavicon() });
        });
        webContents.on('page-favicon-updated', async (e, favicons) => {
            const favicon = await FaviconManager.getFavicon(this.getURL(), favicons[0]);
            const faviconUrl = FaviconManager.toUrl(this.getURL());

            this.favicon = favicon;
            if (favicon && faviconUrl)
                Main.faviconManager.add({ url: faviconUrl, favicon });

            this.updateView();

            if (!this.isLoading())
                this.user.histories.add({ title: this.getTitle(), url: this.getURL(), favicon: this.getFavicon() });
        });
        webContents.on('did-change-theme-color', (e, color) => {
            this.color = color ?? undefined;
            this.updateView();
        });

        webContents.on('context-menu', (e, params) => {
            const menu = getContextMenu(this.window, this, params);
            menu.popup({ window: this.window.browserWindow });
        });
    }


    public updateView() {
        if (this.webContents.isDestroyed()) return;

        this.setWindowTitle();
        this.window.setApplicationMenu();
        this.window.browserWindow.webContents.send(`view-${this.window.id}`, this.getState());
    }
}
