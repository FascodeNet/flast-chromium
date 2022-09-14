import deepmerge from 'deepmerge';
import { BrowserWindow, ipcMain, Menu, NativeImage, nativeImage, Rectangle, TouchBar } from 'electron';
import { APPLICATION_NAME } from '../../constants';
import {
    WINDOW_DOUBLE_APP_BAR_HEIGHT,
    WINDOW_EXTENDED_SIDEBAR_WIDTH,
    WINDOW_EXTENDED_TAB_CONTAINER_WIDTH,
    WINDOW_SINGLE_APP_BAR_HEIGHT
} from '../../constants/design';
import { DIALOG_EXTENSIONS_NAME } from '../../constants/dialog';
import { IPCChannel } from '../../constants/ipc';
import { WindowFullScreenState } from '../../interfaces/window';
import { isHorizontal, isSingle, isVertical } from '../../utils/design';
import { getBuildPath, getIconsPath } from '../../utils/path';
import { IS_DEVELOPMENT } from '../../utils/process';
import { showBookmarksDialog } from '../dialogs/bookmarks';
import { showDownloadsDialog } from '../dialogs/downloads';
import { showExtensionsDialog } from '../dialogs/extensions';
import { showHistoryDialog } from '../dialogs/history';
import { showInformationDialog } from '../dialogs/information';
import { showMenuDialog } from '../dialogs/menu';
import { showProfileDialog } from '../dialogs/profile';
import { showSearchDialog } from '../dialogs/search';
import { WindowImpl } from '../implements/window';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { TabManager } from '../manager/tab';
import { getApplicationMenu } from '../menus/app';
import { getExtensionMenu } from '../menus/extension';
import { getWindowMenu } from '../menus/window';
import { IncognitoUser } from '../user/incognito';
import { NormalUser } from '../user/normal';
import { search } from '../utils/search';

const { TouchBarButton, TouchBarPopover, TouchBarSpacer } = TouchBar;

export class AppWindow extends WindowImpl {

    public readonly incognito: boolean;

    public readonly user: IUser;

    public readonly tabManager: TabManager;

    private applicationMenu: Menu;

    private _fullScreenState: WindowFullScreenState;

    public constructor(user: IUser, urls: string[] = user.settings.startupUrls) {
        super(new BrowserWindow({
            width: 900,
            minWidth: 500,
            height: 700,
            minHeight: 450,
            frame: false,
            show: false,
            titleBarStyle: 'hidden',
            trafficLightPosition: {
                x: 17,
                y: 17
            },
            backgroundColor: user.settings.theme?.manifest?.background_color ?? '#ffffffff',
            title: APPLICATION_NAME,
            icon: nativeImage.createFromPath(getIconsPath('app', 'icon.png')),
            webPreferences: {
                preload: getBuildPath('preloads', 'window.js'),
                nodeIntegration: true,
                contextIsolation: false,
                sandbox: false,
                javascript: true,
                plugins: true,
                session: user.session.session
            }
        }));

        this.incognito = user.type === 'incognito';

        this.user = user;

        this.setListeners();
        this.setupIpc();

        this._fullScreenState = {
            user: this.browserWindow.isFullScreen(),
            html: false
        };

        this.tabManager = new TabManager(this);
        urls.forEach((url) => this.tabManager.add(url));

        this.applicationMenu = getWindowMenu(this);
        Menu.setApplicationMenu(this.applicationMenu);
        this.browserWindow.setMenu(this.applicationMenu);
        this.setTouchBar();

        this.browserWindow.loadFile(getBuildPath('browser', 'app.html'));
        this.setStyle();

        this.webContents.once('dom-ready', () => {
            if (!IS_DEVELOPMENT) return;

            // 開発モードの場合はデベロッパーツールを開く
            this.webContents.openDevTools({ mode: 'detach' });
        });
    }

    public get fullScreenState() {
        return this._fullScreenState;
    }

    /**
     * BrowserView を配置できる領域
     * @returns {Electron.CrossProcessExports.Rectangle}
     */
    public get contentBounds(): Rectangle {
        const { width, height } = this.browserWindow.getContentBounds();
        const userState = this.fullScreenState.user;
        const isFullScreen = this.browserWindow.isFullScreen();

        const {
            style,
            fullscreen_showing_toolbar: isFullScreenShowingToolbar,
            sidebar: { extended, state }
        } = this.user.settings.config.appearance;

        const sidebarWidth = extended ? (state !== 'tab_container' ? WINDOW_EXTENDED_SIDEBAR_WIDTH : WINDOW_EXTENDED_TAB_CONTAINER_WIDTH) : WINDOW_SINGLE_APP_BAR_HEIGHT;

        const contentX = (!isFullScreen || (userState && isFullScreenShowingToolbar)) && style === 'left' ? sidebarWidth : 0;
        const contentY = !isFullScreen || (userState && isFullScreenShowingToolbar) ? (isSingle(style) ? WINDOW_SINGLE_APP_BAR_HEIGHT : WINDOW_DOUBLE_APP_BAR_HEIGHT) : 0;
        const contentWidth = width - ((!isFullScreen || (userState && isFullScreenShowingToolbar)) && isVertical(style) ? sidebarWidth : 0);
        const contentHeight = height - contentY;

        return {
            width: contentWidth,
            height: contentHeight,
            x: contentX,
            y: contentY
        };
    }

    public setApplicationMenu() {
        if (this.isDestroyed) return;

        this.applicationMenu = getWindowMenu(this);
        Menu.setApplicationMenu(this.applicationMenu);
        this.browserWindow.setMenu(this.applicationMenu);
    }

    public async setTouchBar() {
        if (this.isDestroyed) return;

        const view = this.tabManager.get();

        const resizeImage = (image: NativeImage) => image.resize({
            width: 20,
            height: 20
        });

        const getIcon = (name: string) => resizeImage(nativeImage.createFromPath(getIconsPath('white', `${name}.png`)));

        const backButton = new TouchBarButton({
            icon: getIcon('arrow_left'),
            enabled: view && view.canGoBack,
            click: () => {
                if (!view || !view.canGoBack) return;
                view.back();
            }
        });
        const forwardButton = new TouchBarButton({
            icon: getIcon('arrow_right'),
            enabled: view && view.canGoForward,
            click: () => {
                if (!view || !view.canGoForward) return;
                view.forward();
            }
        });
        const reloadButton = new TouchBarButton({
            icon: getIcon(!view || !view.isLoading ? 'reload' : 'remove'),
            enabled: view != null,
            click: () => {
                if (!view) return;
                !view.isLoading ? view.reload() : view.stop();
            }
        });
        const homeButton = new TouchBarButton({
            icon: getIcon('home'),
            click: () => {
                if (!view) return;
                view.load(this.user.settings.homeUrl);
            }
        });

        const searchButton = new TouchBarButton({
            icon: getIcon('search'),
            click: () => {
            }
        });

        const tabManagePopover = new TouchBarPopover({
            label: 'タブの管理',
            showCloseButton: true,
            items: new TouchBar({
                items: [
                    new TouchBarButton({
                        icon: getIcon('tab_add'),
                        label: '新しいタブ',
                        iconPosition: 'left',
                        click: () => {
                            this.tabManager.add();
                        }
                    }),
                    new TouchBarButton({
                        icon: getIcon('tab_remove'),
                        label: 'タブを閉じる',
                        iconPosition: 'left',
                        enabled: view != null,
                        click: () => {
                            if (!view) return;
                            this.tabManager.remove(view.id);
                        }
                    })
                ]
            })
        });
        const windowManagePopover = new TouchBarPopover({
            label: 'ウィンドウの管理',
            showCloseButton: true,
            items: new TouchBar({
                items: [
                    new TouchBarButton({
                        icon: getIcon('window_add'),
                        label: '新しいウィンドウ',
                        iconPosition: 'left',
                        click: () => {
                            if (this.user instanceof NormalUser) {
                                Main.windowManager.add(this.user);
                            } else if (this.user instanceof IncognitoUser) {
                                Main.windowManager.add(this.user.fromUser);
                            }
                        }
                    }),
                    new TouchBarButton({
                        icon: getIcon('window_incognito'),
                        label: 'プライベート ウィンドウを開く',
                        iconPosition: 'left',
                        click: () => {
                            if (this.user instanceof NormalUser) {
                                const incognitoUser = Main.userManager.add(new IncognitoUser(this.user));
                                Main.windowManager.add(incognitoUser, undefined);
                            } else if (this.user instanceof IncognitoUser) {
                                const incognitoUser = Main.userManager.add(new IncognitoUser(this.user.fromUser));
                                Main.windowManager.add(incognitoUser, undefined);
                            }
                        }
                    }),
                    new TouchBarButton({
                        icon: getIcon('tab_remove'),
                        label: 'ウィンドウを閉じる',
                        iconPosition: 'left',
                        click: () => {
                            Main.windowManager.remove(this.id);
                        }
                    })
                ]
            })
        });

        const { home } = this.user.settings.config.appearance.buttons;
        const touchBar = new TouchBar({
            items: [
                backButton,
                forwardButton,
                reloadButton,
                ...(home ? [
                    homeButton,
                    new TouchBarSpacer({ size: 'small' })
                ] : [
                    new TouchBarSpacer({ size: 'small' })
                ]),
                searchButton,
                new TouchBarSpacer({ size: 'large' }),
                tabManagePopover,
                windowManagePopover
            ]
        });

        this.browserWindow.setTouchBar(touchBar);
    }

    public async setStyle() {
        const { color_scheme, theme } = this.user.settings.config.appearance;
        this.browserWindow.setBackgroundColor(this.user.settings.theme?.manifest?.background_color ?? '#ffffffff');
        this.webContents.send(
            IPCChannel.User.UPDATED_THEME(this.user.id),
            this.user.type !== 'incognito' ? color_scheme : 'incognito',
            theme
        );
        this.webContents.send(`window-resize-${this.id}`);
    }

    public close() {
        this.browserWindow.close();
        Main.windowManager.remove(this.id);
    }


    private setViewBounds() {
        const view = this.tabManager.get();
        if (!view) return;
        view.setBounds();
        view.setDialogs();
    }

    private setListeners() {
        const onDestroyed = () => {
            this.tabManager.clear();
            Main.windowManager.remove(this.id);

            Menu.setApplicationMenu(getApplicationMenu(this.user));
        };
        this.webContents.once('destroyed', onDestroyed);
        this.browserWindow.once('closed', onDestroyed);

        this.browserWindow.on('focus', () => {
            Main.windowManager.select(this.id);
            this.setApplicationMenu();
            this.setTouchBar();
            this.setViewBounds();
        });
        this.browserWindow.on('blur', () => {
            Main.windowManager.selectedId = -1;
        });

        this.browserWindow.on('resize', () => {
            this.setViewBounds();
            this.webContents.send(`window-resize-${this.id}`);
        });
        this.browserWindow.on('enter-full-screen', () => {
            console.log('enter-full-screen');
            this._fullScreenState = deepmerge<WindowFullScreenState>(this._fullScreenState, { user: true });
            this.setApplicationMenu();
            this.setTouchBar();
            this.setViewBounds();
            this.webContents.send(`window-resize-${this.id}`);
        });
        this.browserWindow.on('leave-full-screen', () => {
            console.log('leave-full-screen');
            this._fullScreenState = deepmerge<WindowFullScreenState>(this._fullScreenState, { user: false });
            this.setApplicationMenu();
            this.setTouchBar();
            this.setViewBounds();
            this.webContents.send(`window-resize-${this.id}`);
        });
        this.browserWindow.on('enter-html-full-screen', () => {
            console.log('enter-html-full-screen');
            this._fullScreenState = deepmerge<WindowFullScreenState>(this._fullScreenState, { html: true });
            this.setViewBounds();
            this.webContents.send(`window-resize-${this.id}`);
        });
        this.browserWindow.on('leave-html-full-screen', () => {
            console.log('leave-html-full-screen');
            this._fullScreenState = deepmerge<WindowFullScreenState>(this._fullScreenState, { html: false });
            this.setViewBounds();
            this.webContents.send(`window-resize-${this.id}`);
        });


        this.webContents.on('did-finish-load', async () => {
            await this.setStyle();
        });
    }

    private setupIpc() {
        ipcMain.handle(`window-user-${this.id}`, () => {
            return this.user.id;
        });


        ipcMain.handle(IPCChannel.Window.APPLICATION_MENU(this.id), () => {
            const settings = this.user.settings;

            this.applicationMenu.popup({
                window: this.browserWindow,
                x: settings.config.appearance.style !== 'top_double' ? 8 : 0,
                y: settings.config.appearance.style !== 'top_double' ? 42 : 36
            });
        });
        ipcMain.handle(IPCChannel.Window.SIDEBAR(this.id), () => {
            const settings = this.user.settings;
            if (isHorizontal(settings.config.appearance.style)) return;

            settings.config = { appearance: { sidebar: { extended: !settings.config.appearance.sidebar.extended } } };

            const windows = Main.windowManager.getWindows(this.user);
            windows.forEach((window) => {
                window.tabManager.tabs.forEach((view) => view.setBounds());
                window.webContents.send(IPCChannel.User.UPDATED_SETTINGS(this.user.id), settings.config);
            });
        });

        ipcMain.handle(IPCChannel.Window.CLOSE(this.id), () => {
            this.close();
        });


        ipcMain.handle(IPCChannel.Popup.WINDOW_MENU(this.id), (e, x: number, y: number) => {
            showMenuDialog(this.user, this.browserWindow, x, y);
        });
        ipcMain.handle(IPCChannel.Popup.PROFILE(this.id), (e, x: number, y: number) => {
            showProfileDialog(this.user, this.browserWindow, x, y);
        });

        ipcMain.handle(IPCChannel.Popup.SEARCH(this.id), (e, x: number, y: number, width: number) => {
            showSearchDialog(this.user, this, x, y, width);
        });

        ipcMain.handle(IPCChannel.Popup.VIEW_INFORMATION(this.id), (e, x: number, y: number) => {
            showInformationDialog(this.user, this.browserWindow, x, y);
        });
        ipcMain.handle(IPCChannel.Popup.VIEW_FIND(this.id), () => {
            const view = this.tabManager.get();
            if (!view) return;

            view.findInPage(null);
        });

        ipcMain.handle(IPCChannel.Popup.BOOKMARKS(this.id), (e, x: number, y: number) => {
            showBookmarksDialog(this.user, this.browserWindow, x, y);
        });
        ipcMain.handle(IPCChannel.Popup.HISTORY(this.id), (e, x: number, y: number) => {
            showHistoryDialog(this.user, this.browserWindow, x, y);
        });
        ipcMain.handle(IPCChannel.Popup.DOWNLOADS(this.id), (e, x: number, y: number) => {
            showDownloadsDialog(this.user, this.browserWindow, x, y);
        });
        ipcMain.handle(IPCChannel.Popup.EXTENSIONS(this.id), (e, x: number, y: number) => {
            showExtensionsDialog(this.user, this.browserWindow, x, y);
        });


        ipcMain.handle(`window-search-${this.id}`, async (e, keyword: string) => {
            return await search(keyword, this.user);
        });

        ipcMain.handle(`extension-menu-${this.id}`, (e, id: string, x: number, y: number) => {
            const extension = this.webContents.session.getExtension(id);
            if (!extension) return;

            const menu = getExtensionMenu(extension, this);
            if (e.sender.getType() === 'browserView') {
                const dialog = Main.dialogManager.getDynamic(DIALOG_EXTENSIONS_NAME);
                if (!dialog) return;

                menu.popup({
                    window: this.browserWindow,
                    x: dialog.bounds.x + x,
                    y: dialog.bounds.y + y
                });
            } else {
                menu.popup({
                    window: this.browserWindow,
                    x, y
                });
            }
        });
    }
}
