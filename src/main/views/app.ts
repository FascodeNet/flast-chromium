import deepmerge from 'deepmerge';
import { BrowserView, ipcMain, NativeImage } from 'electron';
import { APPLICATION_NAME } from '../../constants';
import { IPCChannel } from '../../constants/ipc';
import { SitePermissionData } from '../../interfaces/user';
import { AppViewInitializerOptions, DefaultFindState, FindState, MediaStatus, ViewState } from '../../interfaces/view';
import { getHeight } from '../../utils/design';
import { getBuildPath } from '../../utils/path';
import { Dialog } from '../dialogs/dialog';
import { showFindDialog } from '../dialogs/find';
import { ViewImpl } from '../implements/view';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { FaviconManager } from '../manager/favicon';
import { getContextMenu, getTabMenu } from '../menus/view';
import { NormalUser } from '../user/normal';
import { getRequestState, RequestState } from '../utils/request';
import { AppWindow } from '../windows/app';

export class AppView extends ViewImpl {

    public readonly user: IUser;

    private _window: AppWindow;

    private _favicon?: string;
    private _color?: string;

    private _pinned: boolean = false;

    private _mediaStatus: MediaStatus = 'none';

    private _requestState?: RequestState;
    private _permissions: Required<SitePermissionData>[] = [];

    public findDialog?: Dialog = undefined;
    private _findState?: FindState = undefined;

    private _captureImage?: NativeImage = undefined;

    public constructor(window: AppWindow, { url }: AppViewInitializerOptions) {
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
        this.handleIpc();

        if (window.user instanceof NormalUser)
            userSession.extensions.addTab(this.webContents, window.browserWindow);

        this.webContents.loadURL(url);
    }

    public get window() {
        return this._window;
    }

    public set window(window: AppWindow) {
        if (!window) return;

        const oldWindow = this._window;
        const oldTabManager = oldWindow.tabManager;
        const newTabManager = window.tabManager;

        const sortedTabs = oldTabManager.tabs;
        const sortedTabIndex = sortedTabs.findIndex((appView) => appView.id === this.id);

        this._window = window;
        if (!newTabManager.sortOrders.includes(this.id))
            newTabManager._sortOrders.push(this.id);

        console.log(`Move view #${this.id}: ${oldWindow.id} to ${window.id}`);
        oldWindow.browserWindow.removeBrowserView(this.browserView);
        newTabManager.select(this);

        this.setBounds();

        this.updateView();
        oldTabManager.updateViews();
        newTabManager.updateViews();

        // 移動前の段階でタブが2つ以上あるか
        if (sortedTabs.length > 1) {
            // 移動したタブのIDと現在選択されているタブのIDが一致しているか
            if (oldTabManager.selectedId === this.id && sortedTabIndex !== -1) {
                // 最後のタブのインデックス
                const lastIndex = sortedTabs.length - 1;

                console.log('タブのウィンドウ間移動', oldTabManager.selectedId, sortedTabs.map((sortedTab) => sortedTab.id), sortedTabIndex, lastIndex);

                // 選択されていたタブが最後かどうか
                if (sortedTabIndex === lastIndex) {
                    console.log('前移動', sortedTabs[sortedTabIndex - 1].id, sortedTabs[sortedTabIndex - 1].url);
                    // 前のタブにフォーカスを合わせる
                    oldTabManager.select(sortedTabs[sortedTabIndex - 1]);
                } else {
                    console.log('後移動', sortedTabs[sortedTabIndex + 1].id, sortedTabs[sortedTabIndex + 1].url);
                    // 次のタブにフォーカスを合わせる
                    oldTabManager.select(sortedTabs[sortedTabIndex + 1]);
                }
            }
        } else {
            oldWindow.browserWindow.close();
            oldWindow.browserWindow.destroy();
        }
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

    public get pinned() {
        return this._pinned;
    }

    public set pinned(pinned: boolean) {
        const tabManager = this.window.tabManager;
        const pinnedViews = tabManager.tabs.filter((view) => view.pinned && view.id !== this.id);
        tabManager.moveTo(this.id, pinnedViews.length);

        this._pinned = pinned;

        this.updateView();
    }

    public get findState() {
        return this._findState;
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
            isPinned: this._pinned,

            findState: this._findState
        };
    }

    public get captureImage() {
        return this._captureImage;
    }


    public findInPage(text: string | null, matchCase: boolean = false) {
        if (!this.findDialog)
            this.findDialog = showFindDialog(this.user, this);

        if (!text) {
            this._findState = DefaultFindState;
            return;
        }

        this.webContents.findInPage(text, { forward: true, findNext: true, matchCase });
        this._findState = {
            text,
            matchCase,

            index: 0,
            matches: 0,

            finalUpdate: false
        };
        this.findDialog.webContents.send(`view-find-${this.window.id}`, this.id, this._findState);

        return this._findState;
    }

    public moveFindInPage(forward: boolean = true) {
        if (!this._findState) return;

        const { text, matchCase } = this._findState;
        if (!text) return;

        this.webContents.findInPage(text, { forward, findNext: false, matchCase });
        this.findDialog?.webContents.send(`view-find-${this.window.id}`, this.id, this._findState);

        return this._findState;
    }

    public stopFindInPage(action: 'clearSelection' | 'keepSelection' | 'activateSelection' = 'keepSelection') {
        this._findState = undefined;
        this.webContents.stopFindInPage(action);
        this.findDialog?.webContents.send(`view-find-${this.window.id}`, this.id, this._findState);
    }


    public setBounds() {
        this.browserView.setAutoResize({ width: true, height: true });
        this.browserView.setBounds(this.window.contentBounds);

        if (this.window.tabManager.selectedId === this.id) {
            this.window.browserWindow.addBrowserView(this.browserView);
            this.window.browserWindow.setTopBrowserView(this.browserView);
        }

        const findDialog = this.findDialog;
        if (findDialog && !findDialog.webContents.isDestroyed()) {
            findDialog.browserWindow = this.window.browserWindow;

            const { width } = this.window.browserWindow.getContentBounds();
            findDialog.bounds = {
                width: 380,
                height: 70,
                x: width - 400,
                y: getHeight(this.user.settings.config.appearance.style)
            };

            Main.dialogManager.show(findDialog);
        }
    }


    public setWindowTitle() {
        if (this.window.tabManager.selectedId !== this.id) return;
        this.window.browserWindow.setTitle(`${this.title} - ${APPLICATION_NAME}`);
    }

    public updateView() {
        if (this.isDestroyed) return;

        this.setWindowTitle();
        this.window.setApplicationMenu();
        this.window.setTouchBar();
        this.window.webContents.send(`view-${this.window.id}`, this.state);
    }


    private setListeners() {
        // tslint:disable-next-line:no-shadowed-variable
        const webContents = this.webContents;
        webContents.once('destroyed', () => {
            this.removeIpc();
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

            const { width, height } = this.browserView.getBounds();
            this._captureImage = await this.webContents.capturePage({ width, height, x: 0, y: 0 });
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

        webContents.on('found-in-page', (e, { activeMatchOrdinal, matches, finalUpdate }) => {
            this._findState = deepmerge<FindState>(this._findState ?? DefaultFindState, {
                index: activeMatchOrdinal,
                matches,
                finalUpdate
            });
            this.findDialog?.webContents.send(`view-find-${this.window.id}`, this.id, this._findState);
        });

        webContents.on('context-menu', (e, params) => {
            const menu = getContextMenu(this.window, this, params);
            menu.popup({ window: this.window.browserWindow });
        });
    }

    private handleIpc() {
        ipcMain.handle(this.ipcChannel.TAB_MENU(this.id), (e, x: number, y: number) => {
            if (this.webContents.isDestroyed()) return;

            const menu = getTabMenu(this.window, this);
            menu.popup({ window: this.window.browserWindow, x, y });
        });

        ipcMain.handle(IPCChannel.Find.START(this.id), (e, text: string, matchCase: boolean) => {
            if (this.isDestroyed) return;
            return this.findInPage(text, matchCase);
        });
        ipcMain.handle(IPCChannel.Find.STOP(this.id), (e, action: 'clearSelection' | 'keepSelection' | 'activateSelection', hideDialog: boolean) => {
            if (this.isDestroyed) return;

            this.stopFindInPage(action);
            if (hideDialog && this.findDialog) {
                Main.dialogManager.destroy(this.findDialog);
                this.findDialog = undefined;
            }
        });
        ipcMain.handle(IPCChannel.Find.MOVE(this.id), (e, forward: boolean) => {
            if (this.isDestroyed) return;
            return this.moveFindInPage(forward);
        });
    }

    private removeIpc() {
        ipcMain.removeHandler(this.ipcChannel.TAB_MENU(this.id));

        ipcMain.removeHandler(IPCChannel.Find.START(this.id));
        ipcMain.removeHandler(IPCChannel.Find.STOP(this.id));
        ipcMain.removeHandler(IPCChannel.Find.MOVE(this.id));
    }
}
