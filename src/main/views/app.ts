import deepmerge from 'deepmerge';
import { app, BrowserView, NativeImage, webContents } from 'electron';
import { join } from 'path';
import {
    WINDOW_EXTENDED_SIDEBAR_WIDTH,
    WINDOW_EXTENDED_TAB_CONTAINER_WIDTH,
    WINDOW_TITLE_BAR_HEIGHT,
    WINDOW_TOOL_BAR_HEIGHT
} from '../../constants/design';
import {
    AppViewInitializerOptions,
    DefaultFindState,
    FindState,
    MediaStatus,
    ViewState,
    ZoomLevel,
    ZoomLevels
} from '../../interfaces/view';
import { APPLICATION_NAME } from '../../utils';
import { getHeight } from '../../utils/design';
import { Dialog } from '../dialogs/dialog';
import { showFindDialog } from '../dialogs/find';
import { IUser } from '../interfaces/user';
import { ViewBoundsMapping } from '../interfaces/view';
import { Main } from '../main';
import { FaviconManager } from '../manager/favicon';
import { getContextMenu } from '../menus/view';
import { getRequestState, RequestState } from '../utils/request';
import { AppWindow } from '../windows/app';

export class AppView {

    public readonly id: number;

    public readonly user: IUser;

    public browserView: BrowserView;

    public window: AppWindow;

    private _favicon?: string;
    private _color?: string;

    private pinned: boolean = false;

    private _mediaStatus: MediaStatus = 'none';

    private _requestState?: RequestState;

    public findDialog: Dialog | undefined = undefined;
    private _findState: FindState | undefined = undefined;

    private _captureImage: NativeImage | undefined = undefined;

    public incognito: boolean = false;

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
        this.browserView.setBackgroundColor('#ffffffff');

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

    public get isLoading() {
        return this.webContents.isLoadingMainFrame();
    }

    public get canGoBack() {
        return this.webContents.canGoBack();
    }

    public get canGoForward() {
        return this.webContents.canGoForward();
    }

    public get title() {
        return this.webContents.getTitle();
    }

    public get url() {
        return this.webContents.getURL();
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

    public get isMuted() {
        return this.webContents.isAudioMuted();
    }

    public setMuted(muted: boolean) {
        this.webContents.setAudioMuted(muted);
        this.updateView();
    }

    public get isPinned() {
        return this.pinned;
    }

    public setPinned(pinned: boolean) {
        this.pinned = pinned;
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
            favicon: this.favicon,
            color: this.color,

            requestState: this.requestState,

            isLoading: this.isLoading,
            canGoBack: this.canGoBack,
            canGoForward: this.canGoForward,

            media: this.mediaStatus,
            isPinned: this.isPinned,

            findState: this.findState
        };
    }

    public get captureImage() {
        return this._captureImage;
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
    }

    public moveFindInPage(forward: boolean = true) {
        if (!this._findState) return;

        const { text, matchCase } = this._findState;
        if (!text) return;
        this.webContents.findInPage(text, { forward, findNext: false, matchCase });
        this.findDialog?.webContents.send(`view-find-${this.window.id}`, this.id, this._findState);
    }

    public stopFindInPage(action: 'clearSelection' | 'keepSelection' | 'activateSelection' = 'keepSelection') {
        this.webContents.stopFindInPage(action);
        this._findState = undefined;
        this.findDialog?.webContents.send(`view-find-${this.window.id}`, this.id, this._findState);
    }


    public setWindowTitle() {
        if (this.window.viewManager.selectedId !== this.id) return;
        this.window.browserWindow.setTitle(`${this.title} - ${APPLICATION_NAME}`);
    }

    public setBounds() {
        if (this.window.viewManager.selectedId !== this.id) return;

        const { width, height } = this.window.browserWindow.getContentBounds();
        const { html: htmlState } = this.window.fullScreenState;
        const isFullScreen = this.window.browserWindow.isFullScreen();
        const isMaximized = this.window.browserWindow.isMaximized();

        this.browserView.setAutoResize({ width: true, height: true });

        const {
            style,
            fullscreen_showing_toolbar: isFullScreenShowingToolbar,
            sidebar: { extended, state }
        } = this.user.settings.config.appearance;

        const sidebarWidth = extended ? (state !== 'tab_container' ? WINDOW_EXTENDED_SIDEBAR_WIDTH : WINDOW_EXTENDED_TAB_CONTAINER_WIDTH) : 50;


        const setBounds = (
            {
                default: defaultRect,
                topSingle,
                topDouble,
                bottomSingle,
                bottomDouble,
                left,
                right
            }: ViewBoundsMapping
        ) => {
            switch (style) {
                case 'top_single':
                    this.browserView.setBounds(topSingle ?? defaultRect);
                    break;
                case 'top_double':
                    this.browserView.setBounds(topDouble ?? defaultRect);
                    break;
                case 'bottom_single':
                    this.browserView.setBounds(bottomSingle ?? defaultRect);
                    break;
                case 'bottom_double':
                    this.browserView.setBounds(bottomDouble ?? defaultRect);
                    break;
                case 'left':
                    this.browserView.setBounds(left ?? defaultRect);
                    break;
                case 'right':
                    this.browserView.setBounds(right ?? defaultRect);
                    break;
                default:
                    this.browserView.setBounds(defaultRect);
            }
        };


        if (isFullScreen) {
            if (htmlState) {
                setBounds({
                    default: {
                        width,
                        height,
                        x: 0,
                        y: 0
                    }
                });
            } else {
                if (isFullScreenShowingToolbar) {
                    const hgt = height - 50;
                    const vertWidth = width - sidebarWidth;
                    setBounds({
                        default: {
                            width,
                            height,
                            x: 0,
                            y: 0
                        },
                        topSingle: {
                            width,
                            height: hgt,
                            x: 0,
                            y: 50
                        },
                        topDouble: {
                            width,
                            height: height - (WINDOW_TITLE_BAR_HEIGHT + WINDOW_TOOL_BAR_HEIGHT),
                            x: 0,
                            y: WINDOW_TITLE_BAR_HEIGHT + WINDOW_TOOL_BAR_HEIGHT
                        },
                        left: {
                            width: vertWidth,
                            height: hgt,
                            x: sidebarWidth,
                            y: 50
                        },
                        right: {
                            width: vertWidth,
                            height: hgt,
                            x: 0,
                            y: 50
                        }
                    });
                } else {
                    setBounds({
                        default: {
                            width,
                            height,
                            x: 0,
                            y: 0
                        }
                    });
                }
            }
        } else if (isMaximized) {
            const hgt = height - 50;
            const vertWidth = width - sidebarWidth;
            setBounds({
                default: {
                    width,
                    height,
                    x: 0,
                    y: 0
                },
                topSingle: {
                    width,
                    height: hgt,
                    x: 0,
                    y: 50
                },
                topDouble: {
                    width,
                    height: height - (WINDOW_TITLE_BAR_HEIGHT + WINDOW_TOOL_BAR_HEIGHT),
                    x: 0,
                    y: WINDOW_TITLE_BAR_HEIGHT + WINDOW_TOOL_BAR_HEIGHT
                },
                left: {
                    width: vertWidth,
                    height: hgt,
                    x: sidebarWidth,
                    y: 50
                },
                right: {
                    width: vertWidth,
                    height: hgt,
                    x: 0,
                    y: 50
                }
            });
        } else {
            const hgt = height - 50;
            const vertWidth = width - sidebarWidth;
            setBounds({
                default: {
                    width,
                    height,
                    x: 0,
                    y: 0
                },
                topSingle: {
                    width,
                    height: hgt,
                    x: 0,
                    y: 50
                },
                topDouble: {
                    width,
                    height: height - (WINDOW_TITLE_BAR_HEIGHT + WINDOW_TOOL_BAR_HEIGHT),
                    x: 0,
                    y: WINDOW_TITLE_BAR_HEIGHT + WINDOW_TOOL_BAR_HEIGHT
                },
                left: {
                    width: vertWidth,
                    height: hgt,
                    x: sidebarWidth,
                    y: 50
                },
                right: {
                    width: vertWidth,
                    height: hgt,
                    x: 0,
                    y: 50
                }
            });
        }

        /*
        const baseWidth = isFullScreen || isMaximized ? width : width - 2;
        const baseHeight = isFullScreen ? (isFullScreenUserByTriggered ? height - 50 : height) : ((isMaximized ? height : height - 1) - 50);
        const baseX = isFullScreen || isMaximized ? 0 : 1;
        const baseY = isFullScreen ? (isFullScreenUserByTriggered ? 50 : 0) : 50;

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
        */

        this.window.browserWindow.addBrowserView(this.browserView);
        this.window.browserWindow.setTopBrowserView(this.browserView);
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

        /*
        const searchDialog = Main.dialogManager.getDynamic(DIALOG_SEARCH_NAME);
        if (searchDialog && !searchDialog.webContents.isDestroyed())
            showSearchDialog(this.user, this.window);
        */
    }

    public updateView() {
        if (this.webContents.isDestroyed()) return;

        this.setWindowTitle();
        this.window.setApplicationMenu();
        this.window.setTouchBar();
        webContents.getAllWebContents().forEach((webContents) => webContents.send(`view-${this.window.id}`, this.state));
    }


    private setListeners() {
        const webContents = this.webContents;
        webContents.on('destroyed', () => {
            const viewManager = this.window.viewManager;
            viewManager.views.delete(this.id);
            viewManager.sortOrders = viewManager.sortOrders.filter((sortId) => sortId !== this.id);
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
            this.updateView();
        });
        webContents.on('did-navigate', async (_, url) => {
            console.log('did-navigate');
            this._requestState = await getRequestState(url);
        });
        webContents.on('did-finish-load', () => {
            this.updateView();
        });
        webContents.on('did-frame-finish-load', async (_, isMainFrame) => {
            if (!isMainFrame) return;

            this._requestState = await getRequestState(this.url);
            this.updateView();

            if (!this.isLoading)
                this.user.histories.add({ title: this.title, url: this.url, favicon: this.favicon });
        });
        webContents.on('did-fail-load', () => {
            this.updateView();
        });

        webContents.on('dom-ready', async () => {
            const { width, height } = this.browserView.getBounds();
            this._captureImage = await this.webContents.capturePage({ width, height, x: 0, y: 0 });
            await this.window.setTouchBar();
        });

        webContents.on('page-title-updated', (_, title) => {
            this.updateView();

            if (!this.isLoading)
                this.user.histories.add({ title, url: this.url, favicon: this.favicon });
        });
        webContents.on('page-favicon-updated', async (e, favicons) => {
            const favicon = await FaviconManager.getFavicon(this.url, favicons[0]);
            const faviconUrl = FaviconManager.toUrl(this.url);

            this._favicon = favicon;
            if (favicon && faviconUrl)
                Main.faviconManager.add({ url: faviconUrl, favicon });

            this.updateView();

            if (!this.isLoading)
                this.user.histories.add({ title: this.title, url: this.url, favicon: this.favicon });
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
}
