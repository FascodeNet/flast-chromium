import deepmerge from 'deepmerge';
import { BrowserWindow, ipcMain, Menu, NativeImage, nativeImage, Rectangle, TouchBar } from 'electron';
import { APPLICATION_NAME } from '../../constants';
import {
    WINDOW_DOUBLE_APP_BAR_HEIGHT,
    WINDOW_DOUBLE_TAB_CONTAINER_HEIGHT,
    WINDOW_DOUBLE_TITLE_BAR_HEIGHT,
    WINDOW_DOUBLE_TOOL_BAR_HEIGHT,
    WINDOW_EXTENDED_TAB_CONTAINER_WIDTH,
    WINDOW_SIDE_VIEW_TOOL_BAR_HEIGHT,
    WINDOW_SIDE_VIEW_WIDTH,
    WINDOW_SINGLE_APP_BAR_HEIGHT
} from '../../constants/design';
import { DIALOG_EXTENSIONS_NAME } from '../../constants/dialog';
import { IPCChannel } from '../../constants/ipc';
import { WindowFullScreenState } from '../../interfaces/window';
import { isHorizontalTabContainer, isVerticalTabContainer } from '../../utils/design';
import { getBuildPath, getIconsPath } from '../../utils/path';
import { IS_DEVELOPMENT, IS_MAC } from '../../utils/process';
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
import { SideView } from '../views/side';

const { TouchBarButton, TouchBarPopover, TouchBarSpacer } = TouchBar;

export class AppWindow extends WindowImpl {

    public readonly incognito: boolean;

    public readonly user: IUser;

    public readonly tabManager: TabManager;

    private applicationMenu: Menu;

    private _fullScreenState: WindowFullScreenState;

    private _sideView?: SideView;

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

        this.incognito = user instanceof IncognitoUser;

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

    public get sideView() {
        return this._sideView;
    }

    public set sideView(view: SideView | undefined) {
        this._sideView = view;
        this.setViewBounds();
    }

    /**
     * BrowserView を配置できる領域
     * @returns {Electron.CrossProcessExports.Rectangle}
     */
    public get contentBounds(): Rectangle {
        const { width, height } = this.browserWindow.getContentBounds();
        const { user: userState, html: htmlState } = this.fullScreenState;

        const {
            fullscreen_showing_toolbar: isFullScreenShowingToolbar,
            toolbar_position: position,
            tab_container: {
                expanded: tabContainerExpanded,
                position: tabContainerPosition,
                side: tabContainerSidePosition
            },
            sidebar: { expanded: sidebarExpanded, position: sidebarPosition }
        } = this.user.settings.config.appearance;

        if ((userState && !isFullScreenShowingToolbar) || htmlState) {
            return {
                width,
                height,
                x: 0,
                y: 0
            };
        }

        const tabContainerWidth = tabContainerExpanded ? WINDOW_EXTENDED_TAB_CONTAINER_WIDTH : WINDOW_SINGLE_APP_BAR_HEIGHT;
        const appbarHeight = (position === 'top' && tabContainerPosition === 'bottom') || (position === 'bottom' && tabContainerPosition === 'top') || (isHorizontalTabContainer(tabContainerPosition) && tabContainerSidePosition !== 'default') ? WINDOW_DOUBLE_APP_BAR_HEIGHT : WINDOW_SINGLE_APP_BAR_HEIGHT;

        // 領域の幅
        let contentWidth = width;
        // 領域の高さ
        let contentHeight = height;
        // 横方向の表示開始位置 (右にずらす)
        let contentX = 0;
        // 縦方向の表示開始位置 (下にずらす)
        let contentY = 0;


        // 領域の幅を減らす
        if (isVerticalTabContainer(tabContainerPosition))
            contentWidth -= tabContainerWidth;

        // サイドバーの幅分減らす
        if (this._sideView || sidebarExpanded)
            contentWidth -= (WINDOW_SIDE_VIEW_WIDTH + 10);

        if (sidebarPosition !== 'none')
            contentWidth -= WINDOW_SINGLE_APP_BAR_HEIGHT;

        // 領域の高さを減らす
        contentHeight -= appbarHeight;

        if (!userState && position === 'bottom' && tabContainerPosition !== 'top')
            contentHeight -= WINDOW_DOUBLE_TITLE_BAR_HEIGHT;

        // タブコンテナが左側の場合のみ表示開始位置を右方向にずらす
        if (tabContainerPosition === 'left')
            contentX += tabContainerWidth;

        if (sidebarPosition === 'left' && (this._sideView || sidebarExpanded))
            contentX += (WINDOW_SIDE_VIEW_WIDTH + 10);

        // ツールバーとタブコンテナの配置の設定に応じて表示開始位置を下方向にずらす
        if (!userState && position === 'bottom' && tabContainerPosition !== 'top')
            contentY += WINDOW_DOUBLE_TITLE_BAR_HEIGHT;
        else if (position === 'top' && tabContainerPosition === 'bottom')
            contentY += WINDOW_DOUBLE_TOOL_BAR_HEIGHT;
        else if (position === 'bottom' && tabContainerPosition === 'top')
            contentY += WINDOW_DOUBLE_TAB_CONTAINER_HEIGHT;
        else if (position === 'top')
            contentY += appbarHeight;

        return {
            width: contentWidth,
            height: contentHeight,
            x: contentX,
            y: contentY
        };
    }

    public get sideViewBounds(): Rectangle {
        const { width, height } = this.browserWindow.getContentBounds();
        const { user: userState, html: htmlState } = this.fullScreenState;

        const {
            toolbar_position: position,
            tab_container: {
                expanded: tabContainerExpanded,
                position: tabContainerPosition,
                side: tabContainerSidePosition
            },
            sidebar: { expanded: sidebarExpanded, position: sidebarPosition }
        } = this.user.settings.config.appearance;

        if (htmlState) {
            return {
                width: 0,
                height: 0,
                x: 0,
                y: 0
            };
        }

        const tabContainerWidth = tabContainerExpanded ? WINDOW_EXTENDED_TAB_CONTAINER_WIDTH : WINDOW_SINGLE_APP_BAR_HEIGHT;
        const appbarHeight = (position === 'top' && tabContainerPosition === 'bottom') || (position === 'bottom' && tabContainerPosition === 'top') || (isHorizontalTabContainer(tabContainerPosition) && tabContainerSidePosition !== 'default') ? WINDOW_DOUBLE_APP_BAR_HEIGHT : WINDOW_SINGLE_APP_BAR_HEIGHT;

        // 領域の幅
        const contentWidth = 400;
        // 領域の高さ
        let contentHeight = height - (WINDOW_SIDE_VIEW_TOOL_BAR_HEIGHT + 5);
        // 横方向の表示開始位置 (右にずらす)
        const contentX = (sidebarPosition === 'left' ? WINDOW_SINGLE_APP_BAR_HEIGHT : (width - ((sidebarPosition === 'right' ? WINDOW_SINGLE_APP_BAR_HEIGHT : 0) + WINDOW_SIDE_VIEW_WIDTH))) - 5;
        // 縦方向の表示開始位置 (下にずらす)
        let contentY = WINDOW_SIDE_VIEW_TOOL_BAR_HEIGHT;

        // 領域の高さを減らす
        contentHeight -= appbarHeight;

        if (!userState && position === 'bottom' && tabContainerPosition !== 'top')
            contentHeight -= WINDOW_DOUBLE_TITLE_BAR_HEIGHT;

        // ツールバーとタブコンテナの配置の設定に応じて表示開始位置を下方向にずらす
        if (!userState && position === 'bottom' && tabContainerPosition !== 'top')
            contentY += WINDOW_DOUBLE_TITLE_BAR_HEIGHT;
        else if (position === 'top' && tabContainerPosition === 'bottom')
            contentY += WINDOW_DOUBLE_TOOL_BAR_HEIGHT;
        else if (position === 'bottom' && tabContainerPosition === 'top')
            contentY += WINDOW_DOUBLE_TAB_CONTAINER_HEIGHT;
        else if (position === 'top')
            contentY += appbarHeight;

        return {
            width: contentWidth,
            height: contentHeight,
            x: contentX,
            y: contentY
        };
    }


    public setViewBounds() {
        const {
            toolbar_position: position,
            tab_container: { position: tabContainerPosition, side: tabContainerSidePosition }
        } = this.user.settings.config.appearance;

        if (IS_MAC) {
            if ((position === 'bottom' && tabContainerPosition === 'bottom') || (position === 'bottom' && isVerticalTabContainer(tabContainerPosition)))
                this.browserWindow.setTrafficLightPosition({ x: 5, y: 5 });
            else if ((position === 'bottom' && tabContainerPosition === 'top') || (position === 'top' && tabContainerSidePosition === 'outside'))
                this.browserWindow.setTrafficLightPosition({ x: 11, y: 11 });
            else if ((position === 'top' && tabContainerPosition === 'bottom') || (position === 'top' && tabContainerSidePosition === 'inside'))
                this.browserWindow.setTrafficLightPosition({ x: 13, y: 13 });
            else
                this.browserWindow.setTrafficLightPosition({ x: 17, y: 17 });
        }

        if (!this._fullScreenState.html)
            this._sideView?.setBounds();
        this.tabManager.tabs.forEach((view) => view.setBounds());
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

        });
        ipcMain.handle(IPCChannel.Window.SIDEBAR(this.id), () => {

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
