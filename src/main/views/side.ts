import { app, BrowserView } from 'electron';
import { APPLICATION_NAME } from '../../constants';
import { SitePermissionData } from '../../interfaces/user';
import { MediaStatus, ViewState } from '../../interfaces/view';
import { getBuildPath } from '../../utils/path';
import { ViewImpl } from '../implements/view';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { FaviconManager } from '../manager/favicon';
import { NormalUser } from '../user/normal';
import { getRequestState, RequestState } from '../utils/request';
import { AppWindow } from '../windows/app';

export class SideView extends ViewImpl {

    public readonly user: IUser;

    private _window: AppWindow;

    private _favicon?: string;
    private _color?: string;

    private _mediaStatus: MediaStatus = 'none';

    private _requestState?: RequestState;
    private _permissions: Required<SitePermissionData>[] = [];

    public constructor(window: AppWindow, url: string) {
        const userSession = window.user.session;

        super(new BrowserView({
            webPreferences: {
                preload: getBuildPath('preloads', 'view.js'),
                nodeIntegration: false,
                contextIsolation: true,
                sandbox: true,
                javascript: true,
                plugins: false,
                experimentalFeatures: true,
                scrollBounce: true,
                safeDialogs: true,
                safeDialogsMessage: '今後このページではダイアログを表示しない',
                session: userSession.session
            }
        }));
        this.browserView.setBackgroundColor('#ffffffff');

        this.user = window.user;

        this._window = window;
        // this.setBounds();

        this.setListeners();
        this.webContents.setWindowOpenHandler(({ url: handlerUrl, frameName, disposition }) => {
            console.log(handlerUrl, frameName, disposition);
            if (disposition === 'new-window') {
                if (frameName === '_self') {
                    this.webContents.loadURL(handlerUrl);
                } else {
                    Main.windowManager.add(window.user, [handlerUrl]);
                }
            } else if (disposition === 'foreground-tab') {
                this.window.tabManager.add(handlerUrl);
            } else if (disposition === 'background-tab') {
                this.window.tabManager.add(handlerUrl, false);
            }

            return { action: 'deny' };
        });

        if (window.user instanceof NormalUser)
            userSession.extensions.addTab(this.webContents, window.browserWindow);

        this.webContents.setUserAgent(`Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Mobile Safari/537.36 ${APPLICATION_NAME}/${app.getVersion()}`);

        this.webContents.loadURL(url);
    }

    public get window() {
        return this._window;
    }

    public get favicon() {
        return this._favicon;
    }

    public get color() {
        return this._color;
    }

    public get mediaStatus() {
        return this._mediaStatus;
    }

    public get requestState() {
        return this._requestState;
    }

    public get permissions() {
        return this._permissions;
    }

    public zoomReset() {
        this.zoomLevel = this.user.settings.config.sites.contents.zoom_level;
    }

    public get muted() {
        return this.webContents.isAudioMuted();
    }

    public set muted(muted: boolean) {
        this.webContents.setAudioMuted(muted);
        this.updateView();
    }

    public get state(): ViewState {
        return {
            id: this.id,
            title: this.title,
            url: this.url,
            favicon: this._favicon,
            color: this._color,
            zoomLevel: this.zoomLevel,

            isLoading: this.isLoading,
            canGoBack: this.canGoBack,
            canGoForward: this.canGoForward,

            requestState: this._requestState,
            permissions: this._permissions,

            media: this._mediaStatus,
            isPinned: false,

            findState: undefined
        };
    }


    public setBounds() {
        this.browserView.setAutoResize({ width: true, height: true });
        this.browserView.setBounds(this.window.sideViewBounds);

        this.window.browserWindow.addBrowserView(this.browserView);
        this.window.browserWindow.setTopBrowserView(this.browserView);
    }


    public updateView() {
        if (this.isDestroyed) return;

    }


    private setListeners() {
        // tslint:disable-next-line:no-shadowed-variable
        const webContents = this.webContents;
        webContents.once('destroyed', () => {
            this.window.tabManager.remove(this.id);
        });

        webContents.on('did-start-loading', async () => {
            const faviconUrl = FaviconManager.toUrl(this.url);
            if (faviconUrl)
                this._favicon = (await Main.faviconManager.get(faviconUrl))?.favicon;

            this.updateView();
        });
        webContents.on('did-stop-loading', () => {
            this.updateView();
        });
        webContents.on('did-start-navigation', (e, url, isInPlace, isMainFrame) => {
            if (isInPlace || !isMainFrame) return;

            this._requestState = undefined;
            this._permissions = [];
            this.updateView();
        });
        webContents.on('did-navigate', async (_, url) => {
            // tslint:disable-next-line:no-console
            console.log('did-navigate');
            this._requestState = await getRequestState(url);
            this._permissions = this.user.sites.permissions.filter((site) => site.origin === new URL(url).origin);
        });
        webContents.on('did-finish-load', () => {
            this.updateView();
        });
        webContents.on('did-frame-finish-load', async (_, isMainFrame) => {
            if (!isMainFrame) return;

            this._requestState = await getRequestState(this.url);
            this._permissions = this.user.sites.permissions.filter((site) => site.origin === new URL(this.url).origin);
            this.updateView();

            if (!this.isLoading)
                this.user.history.add({ title: this.title, url: this.url, favicon: this.favicon });
        });
        webContents.on('did-fail-load', () => {
            this.updateView();
        });

        webContents.on('dom-ready', async () => {
            await webContents.setVisualZoomLevelLimits(1, 3);
            await this.window.setTouchBar();
        });

        webContents.on('page-title-updated', (_, title) => {
            this.updateView();

            if (!this.isLoading)
                this.user.history.add({ title, url: this.url, favicon: this.favicon });
        });
        webContents.on('page-favicon-updated', async (e, favicons) => {
            const favicon = await FaviconManager.getFavicon(this.url, favicons[0]);
            const faviconUrl = FaviconManager.toUrl(this.url);

            this._favicon = favicon;
            if (favicon && faviconUrl)
                Main.faviconManager.add({ url: faviconUrl, favicon });

            this.updateView();

            if (!this.isLoading)
                this.user.history.add({ title: this.title, url: this.url, favicon: this.favicon });
        });
        webContents.on('did-change-theme-color', (_, color) => {
            this._color = color ?? undefined;
            this.updateView();
        });

        webContents.on('context-menu', (e, params) => {
            // const menu = getContextMenu(this.window, this, params);
            // menu.popup({ window: this.window.browserWindow });
        });
    }
}
