import faker from '@faker-js/faker';
import { app, dialog, Menu, MenuItemConstructorOptions, nativeImage } from 'electron';
import { author } from '../../../package.json';
import {
    APPLICATION_NAME,
    APPLICATION_PROTOCOL,
    APPLICATION_WEB_APPLICATIONS,
    APPLICATION_WEB_BOOKMARKS,
    APPLICATION_WEB_DOWNLOADS,
    APPLICATION_WEB_EXTENSIONS,
    APPLICATION_WEB_HISTORY,
    APPLICATION_WEB_SETTINGS
} from '../../constants';
import { IPCChannel } from '../../constants/ipc';
import { getTranslate } from '../../languages/language';
import { isHorizontal } from '../../utils/design';
import { getIconsPath } from '../../utils/path';
import { IS_MAC } from '../../utils/process';
import { App, Main } from '../main';
import { IncognitoUser } from '../user/incognito';
import { NormalUser } from '../user/normal';
import { getEmptyMenuItemIcon, getMenuItemIcon, getMenuItemIconFromName, joinTo, resizeIcon } from '../utils/menu';
import { AppView } from '../views/app';
import { AppWindow } from '../windows/app';
import { Shortcuts } from './shortcuts';

export const getWindowMenu = (window: AppWindow) => {
    const translate = getTranslate(window.user.settings.config);
    const languageSection = translate.menus.window;

    const viewManager = window.viewManager;
    const view = viewManager.get();

    const getFavicon = (appView: AppView) => {
        let dataURL = appView.favicon;
        if (dataURL) {
            // some favicon data urls have a corrupted base 64 file type descriptor
            // prefixed with data:png;base64, instead of data:image/png;base64,
            // see: https://github.com/electron/electron/issues/23369
            if (!dataURL.split(',')[0].includes('image')) {
                const split = dataURL.split(':');
                dataURL = split.join(':image/');
            }

            return resizeIcon(nativeImage.createFromDataURL(dataURL));
        } else {
            return getEmptyMenuItemIcon();
        }
    };

    const showAboutPanel = () => {
        dialog.showMessageBox({
            title: languageSection.help.about,
            message: APPLICATION_NAME,
            detail: `バージョン: ${app.getVersion()}\n© ${new Date().getFullYear()} ${author.name}. All rights reserved.`,
            buttons: [],
            icon: nativeImage.createFromPath(getIconsPath('app', 'icon.png'))
        });
    };

    const applicationOptions: MenuItemConstructorOptions | undefined = IS_MAC ? {
        label: languageSection.app.label,
        icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
        submenu: [
            {
                label: languageSection.app.about,
                click: () => showAboutPanel()
            },
            { type: 'separator' },
            {
                label: languageSection.app.services,
                role: 'services'
            },
            { type: 'separator' },
            {
                label: languageSection.app.hide,
                role: 'hide'
            },
            {
                label: languageSection.app.hideOthers,
                role: 'hideOthers'
            },
            {
                label: languageSection.app.showAll,
                role: 'unhide'
            },
            { type: 'separator' },
            {
                label: languageSection.app.quit,
                role: 'quit'
            }
        ]
    } : undefined;

    const fileOptions: MenuItemConstructorOptions = {
        label: `${languageSection.file.label}(&F)`,
        icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
        accelerator: 'Alt+F',
        submenu: [
            {
                label: languageSection.file.newTab,
                icon: !IS_MAC ? getMenuItemIconFromName('tab_add') : undefined,
                accelerator: Shortcuts.TAB_ADD,
                click: () => viewManager.add()
            },
            {
                label: languageSection.file.newWindow,
                icon: !IS_MAC ? getMenuItemIconFromName('window_add') : undefined,
                accelerator: Shortcuts.WINDOW_ADD,
                click: () => {
                    if (window.user instanceof NormalUser) {
                        Main.windowManager.add(window.user);
                    } else if (window.user instanceof IncognitoUser) {
                        Main.windowManager.add(window.user.fromUser);
                    }
                }
            },
            {
                label: languageSection.file.openIncognitoWindow,
                icon: !IS_MAC ? getMenuItemIconFromName('window_incognito') : undefined,
                accelerator: Shortcuts.WINDOW_INCOGNITO,
                click: () => {
                    if (window.user instanceof NormalUser) {
                        const incognitoUser = Main.userManager.add(new IncognitoUser(window.user));
                        Main.windowManager.add(incognitoUser, undefined);
                    } else if (window.user instanceof IncognitoUser) {
                        const incognitoUser = Main.userManager.add(new IncognitoUser(window.user.fromUser));
                        Main.windowManager.add(incognitoUser, undefined);
                    }
                }
            },
            { type: 'separator' },
            {
                label: languageSection.file.savePage,
                icon: !IS_MAC ? getMenuItemIconFromName('save_as') : undefined,
                accelerator: Shortcuts.SAVE_AS,
                click: () => {
                    if (!view) return;

                    dialog.showSaveDialog({
                        defaultPath: `${app.getPath('downloads')}/${view.title}`,
                        filters: [
                            { name: 'Web ページ', extensions: ['html'] }
                        ]
                    }).then((result) => {
                        if (result.canceled || !result.filePath) return;

                        view.webContents.savePage(result.filePath, 'HTMLComplete').then(() => {
                            console.log('Page was saved successfully.');
                        }).catch((err) => {
                            if (!err) console.log('Page Save successfully');
                        });
                    });
                }
            },
            {
                label: languageSection.file.print,
                icon: !IS_MAC ? getMenuItemIconFromName('print') : undefined,
                accelerator: Shortcuts.PRINT,
                click: () => {
                    if (!view) return;
                    view.webContents.print();
                }
            },
            { type: 'separator' },
            {
                label: languageSection.file.settings,
                icon: !IS_MAC ? getMenuItemIconFromName('settings') : undefined,
                accelerator: Shortcuts.SETTINGS,
                click: () => {
                    const url = `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_SETTINGS}`;

                    const pageView = viewManager.views.find((appView) => appView.url.startsWith(url));
                    if (pageView) {
                        viewManager.select(pageView.id);
                    } else {
                        viewManager.add(url);
                    }
                }
            },
            { type: 'separator' },
            {
                label: languageSection.file.closeTab,
                icon: !IS_MAC ? getMenuItemIconFromName('tab_remove') : undefined,
                accelerator: Shortcuts.TAB_REMOVE,
                click: () => viewManager.remove()
            },
            {
                label: languageSection.file.closeWindow,
                icon: !IS_MAC ? getMenuItemIconFromName('window_remove') : undefined,
                accelerator: Shortcuts.WINDOW_REMOVE,
                click: () => window.close()
            },
            {
                label: languageSection.file.quit,
                icon: !IS_MAC ? getMenuItemIconFromName('remove') : undefined,
                accelerator: !IS_MAC ? 'Ctrl+Shift+Q' : 'Cmd+Q',
                enabled: !IS_MAC,
                visible: !IS_MAC,
                click: () => window.close()
            }
        ]
    };

    const editOptions: MenuItemConstructorOptions = {
        label: `${languageSection.edit.label}(&E)`,
        icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
        accelerator: 'Alt+E',
        submenu: [
            {
                label: languageSection.edit.undo,
                icon: !IS_MAC ? getMenuItemIconFromName('undo') : undefined,
                accelerator: Shortcuts.EDIT_UNDO,
                role: 'undo'
            },
            {
                label: languageSection.edit.redo,
                icon: !IS_MAC ? getMenuItemIconFromName('redo') : undefined,
                accelerator: Shortcuts.EDIT_REDO,
                role: 'redo'
            },
            { type: 'separator' },
            {
                label: languageSection.edit.cut,
                icon: !IS_MAC ? getMenuItemIconFromName('cut') : undefined,
                accelerator: Shortcuts.EDIT_CUT,
                role: 'cut'
            },
            {
                label: languageSection.edit.copy,
                icon: !IS_MAC ? getMenuItemIconFromName('copy') : undefined,
                accelerator: Shortcuts.EDIT_COPY,
                role: 'copy'
            },
            {
                label: languageSection.edit.paste,
                icon: !IS_MAC ? getMenuItemIconFromName('paste') : undefined,
                accelerator: Shortcuts.EDIT_PASTE,
                role: 'pasteAndMatchStyle'
            },
            {
                label: languageSection.edit.pastePlainText,
                icon: !IS_MAC ? getMenuItemIconFromName('paste_as_plain_text') : undefined,
                accelerator: Shortcuts.EDIT_PASTE_AS_PLAIN_TEXT,
                role: 'paste'
            },
            {
                label: languageSection.edit.delete,
                icon: !IS_MAC ? getMenuItemIconFromName('backspace') : undefined,
                accelerator: Shortcuts.EDIT_DELETE,
                role: 'delete'
            },
            { type: 'separator' },
            {
                label: languageSection.edit.selectAll,
                icon: !IS_MAC ? getMenuItemIconFromName('select_all') : undefined,
                accelerator: Shortcuts.EDIT_SELECT_ALL,
                role: 'selectAll'
            },
            { type: 'separator' },
            {
                label: languageSection.edit.find,
                icon: !IS_MAC ? getMenuItemIconFromName('search') : undefined,
                accelerator: Shortcuts.FIND_1,
                click: () => {
                    if (!view) return;
                    view.findInPage(null);
                }
            },
            {
                label: languageSection.edit.find,
                icon: !IS_MAC ? getMenuItemIconFromName('search') : undefined,
                accelerator: Shortcuts.FIND_2,
                visible: false,
                click: () => {
                    if (!view) return;
                    view.findInPage(null);
                }
            }
        ]
    };

    const viewOptions: MenuItemConstructorOptions = {
        label: `${languageSection.view.label}(&V)`,
        icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
        accelerator: 'Alt+V',
        submenu: [
            {
                label: languageSection.view.fullScreen,
                icon: !IS_MAC ? getMenuItemIconFromName(!window.browserWindow.fullScreen ? 'expand' : 'shrink') : undefined,
                accelerator: Shortcuts.FULLSCREEN,
                click: () => window.browserWindow.setFullScreen(!window.browserWindow.fullScreen)
            },
            {
                label: languageSection.view.toolbar,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.TOOLBAR,
                enabled: window.browserWindow.isFullScreen() && window.fullScreenState.user && !window.fullScreenState.html,
                click: () => {
                    const settings = window.user.settings;

                    settings.config = { appearance: { fullscreen_showing_toolbar: !settings.config.appearance.fullscreen_showing_toolbar } };

                    const windows = Main.windowManager.getWindows(window.user);
                    windows.forEach((appWindow) => {
                        appWindow.viewManager.views.forEach((appView) => appView.setBounds());
                        appWindow.webContents.send(IPCChannel.User.UPDATED_SETTINGS(appWindow.user.id), settings.config);
                    });
                }
            },
            { type: 'separator' },
            {
                label: languageSection.view.sidebar,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.SIDEBAR,
                click: () => {
                    const settings = window.user.settings;
                    if (isHorizontal(settings.config.appearance.style)) return;

                    settings.config = { appearance: { sidebar: { extended: !settings.config.appearance.sidebar.extended } } };

                    const windows = Main.windowManager.getWindows(window.user);
                    windows.forEach((appWindow) => {
                        appWindow.viewManager.views.forEach((appView) => appView.setBounds());
                        appWindow.webContents.send(IPCChannel.User.UPDATED_SETTINGS(appWindow.user.id), settings.config);
                    });
                }
            },
            { type: 'separator' },
            {
                label: languageSection.view.zoomIn,
                icon: !IS_MAC ? getMenuItemIconFromName('zoom_in') : undefined,
                accelerator: Shortcuts.ZOOM_IN_1,
                click: () => {
                    if (!view) return;
                    view.zoomIn();
                }
            },
            {
                label: languageSection.view.zoomIn,
                icon: !IS_MAC ? getMenuItemIconFromName('zoom_in') : undefined,
                accelerator: Shortcuts.ZOOM_IN_2,
                visible: false,
                click: () => {
                    if (!view) return;
                    view.zoomIn();
                }
            },
            {
                label: languageSection.view.zoomOut,
                icon: !IS_MAC ? getMenuItemIconFromName('zoom_out') : undefined,
                accelerator: Shortcuts.ZOOM_OUT_1,
                click: () => {
                    if (!view) return;
                    view.zoomOut();
                }
            },
            {
                label: languageSection.view.zoomOut,
                icon: !IS_MAC ? getMenuItemIconFromName('zoom_out') : undefined,
                accelerator: Shortcuts.ZOOM_OUT_2,
                visible: false,
                click: () => {
                    if (!view) return;
                    view.zoomOut();
                }
            },
            {
                label: languageSection.view.zoomReset,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.ZOOM_RESET_1,
                click: () => {
                    if (!view) return;
                    view.zoomReset();
                }
            },
            {
                label: languageSection.view.zoomReset,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.ZOOM_RESET_2,
                visible: false,
                click: () => {
                    if (!view) return;
                    view.zoomReset();
                }
            },
            { type: 'separator' },
            {
                label: languageSection.view.viewSource,
                icon: !IS_MAC ? getMenuItemIconFromName('view_source') : undefined,
                accelerator: Shortcuts.VIEW_SOURCE,
                enabled: !viewManager.get()?.url.startsWith('view-source:'),
                click: () => {
                    if (!view) return;

                    const appView = viewManager.add('about:blank');
                    appView.load(`view-source:${view.url}`);
                }
            },
            {
                label: languageSection.view.devTool,
                icon: !IS_MAC ? getMenuItemIconFromName('inspect') : undefined,
                accelerator: Shortcuts.DEVELOPER_TOOLS_1,
                click: () => {
                    if (!view) return;

                    const webContents = view.webContents;
                    webContents.isDevToolsOpened() ? webContents.closeDevTools() : webContents.openDevTools();
                }
            },
            {
                label: languageSection.view.devTool,
                icon: !IS_MAC ? getMenuItemIconFromName('inspect') : undefined,
                accelerator: Shortcuts.DEVELOPER_TOOLS_2,
                visible: false,
                click: () => {
                    if (!view) return;

                    const webContents = view.webContents;
                    webContents.isDevToolsOpened() ? webContents.closeDevTools() : webContents.openDevTools();
                }
            },
            {
                label: languageSection.view.appDevTool,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.APPLICATION_DEVELOPER_TOOLS,
                visible: false,
                click: () => window.browserWindow.webContents.openDevTools({ mode: 'detach' })
            }
        ]
    };

    const navigationOptions: MenuItemConstructorOptions = {
        label: `${languageSection.navigation.label}(&N)`,
        icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
        accelerator: 'Alt+N',
        submenu: [
            {
                label: languageSection.navigation.intelligentSearch,
                icon: !IS_MAC ? getMenuItemIconFromName('search') : undefined,
                accelerator: Shortcuts.NAVIGATION_SEARCH,
                click: () => {
                    // showSearchDialog(window.user, window);
                }
            },
            { type: 'separator' },
            {
                label: languageSection.navigation.back,
                icon: !IS_MAC ? getMenuItemIconFromName('arrow_left') : undefined,
                accelerator: Shortcuts.NAVIGATION_BACK,
                click: () => {
                    if (!view) return;
                    view.back();
                }
            },
            {
                label: languageSection.navigation.forward,
                icon: !IS_MAC ? getMenuItemIconFromName('arrow_right') : undefined,
                accelerator: Shortcuts.NAVIGATION_FORWARD,
                click: () => {
                    if (!view) return;
                    view.forward();
                }
            },
            { type: 'separator' },
            {
                label: languageSection.navigation.reload,
                icon: !IS_MAC ? getMenuItemIconFromName('reload') : undefined,
                accelerator: Shortcuts.NAVIGATION_RELOAD_1,
                click: () => {
                    if (!view) return;
                    !view.isLoading ? view.reload() : view.stop();
                }
            },
            {
                label: languageSection.navigation.reload,
                icon: !IS_MAC ? getMenuItemIconFromName('reload') : undefined,
                accelerator: Shortcuts.NAVIGATION_RELOAD_2,
                visible: false,
                click: () => {
                    if (!view) return;
                    !view.isLoading ? view.reload() : view.stop();
                }
            },
            {
                label: languageSection.navigation.reloadIgnoringCache,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.NAVIGATION_RELOAD_IGNORING_CACHE,
                click: () => {
                    if (!view) return;
                    !view.isLoading ? view.reload(true) : view.stop();
                }
            },
            { type: 'separator' },
            {
                label: languageSection.navigation.home,
                icon: !IS_MAC ? getMenuItemIconFromName('home') : undefined,
                accelerator: Shortcuts.NAVIGATION_HOME,
                click: () => {
                    if (!view) return;
                    view.load(window.user.settings.homeUrl);
                }
            },
            { type: 'separator' },
            {
                label: languageSection.navigation.bookmarks,
                icon: !IS_MAC ? getMenuItemIconFromName('bookmarks') : undefined,
                accelerator: Shortcuts.NAVIGATION_BOOKMARKS,
                click: () => {
                    const url = `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_BOOKMARKS}`;

                    const pageView = viewManager.views.find((appView) => appView.url.startsWith(url));
                    if (pageView) {
                        viewManager.select(pageView.id);
                    } else {
                        viewManager.add(url);
                    }
                }
            },
            {
                label: languageSection.navigation.history,
                icon: !IS_MAC ? getMenuItemIconFromName('history') : undefined,
                accelerator: Shortcuts.NAVIGATION_HISTORY,
                click: () => {
                    const url = `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HISTORY}`;

                    const pageView = viewManager.views.find((appView) => appView.url.startsWith(url));
                    if (pageView) {
                        viewManager.select(pageView.id);
                    } else {
                        viewManager.add(url);
                    }
                }
            },
            {
                label: languageSection.navigation.downloads,
                icon: !IS_MAC ? getMenuItemIconFromName('downloads') : undefined,
                accelerator: Shortcuts.NAVIGATION_DOWNLOADS,
                click: () => {
                    const url = `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_DOWNLOADS}`;

                    const pageView = viewManager.views.find((appView) => appView.url.startsWith(url));
                    if (pageView) {
                        viewManager.select(pageView.id);
                    } else {
                        viewManager.add(url);
                    }
                }
            },
            {
                label: languageSection.navigation.applications,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                click: () => {
                    const url = `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_APPLICATIONS}`;

                    const pageView = viewManager.views.find((appView) => appView.url.startsWith(url));
                    if (pageView) {
                        viewManager.select(pageView.id);
                    } else {
                        viewManager.add(url);
                    }
                }
            },
            {
                label: languageSection.navigation.extensions,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                click: () => {
                    const url = `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_EXTENSIONS}`;

                    const pageView = viewManager.views.find((appView) => appView.url.startsWith(url));
                    if (pageView) {
                        viewManager.select(pageView.id);
                    } else {
                        viewManager.add(url);
                    }
                }
            }
        ]
    };

    const tabOptions: MenuItemConstructorOptions = {
        label: `${languageSection.tab.label}(&T)`,
        icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
        accelerator: 'Alt+T',
        submenu: [
            {
                label: languageSection.tab.addTab,
                icon: !IS_MAC ? getMenuItemIconFromName('tab_add') : undefined,
                accelerator: Shortcuts.TAB_ADD,
                click: () => {
                    const appView = viewManager.add();
                    viewManager.select(appView.id);
                }
            },
            {
                label: languageSection.tab.removeTab,
                icon: !IS_MAC ? getMenuItemIconFromName('tab_remove') : undefined,
                accelerator: Shortcuts.TAB_REMOVE,
                click: () => viewManager.remove()
            },
            {
                label: languageSection.tab.removeOtherTabs,
                icon: !IS_MAC ? getMenuItemIconFromName('tab_remove_all') : undefined,
                enabled: viewManager.views.filter((v) => v.id !== viewManager.selectedId).length > 0,
                click: () => {
                    if (!view) return;
                    viewManager.removeOthers(view.id);
                }
            },
            {
                label: languageSection.tab.removeLeftTabs,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                enabled: viewManager.getLeftViews(viewManager.selectedId).length > 0,
                click: () => {
                    if (!view) return;
                    viewManager.removeLefts(view.id);
                }
            },
            {
                label: languageSection.tab.removeRightTabs,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                enabled: viewManager.getRightViews(viewManager.selectedId).length > 0,
                click: () => {
                    if (!view) return;
                    viewManager.removeRights(view.id);
                }
            },
            { type: 'separator' },
            {
                label: languageSection.tab.duplicateTab,
                icon: !IS_MAC ? getMenuItemIconFromName('tab_duplicate') : undefined,
                accelerator: Shortcuts.TAB_DUPLICATE,
                click: () => {
                    if (!view) return;
                    viewManager.add(view.url);
                }
            },
            {
                label: !view || !view.pinned ? languageSection.tab.pinTab : languageSection.tab.unpinTab,
                icon: !IS_MAC ? getMenuItemIconFromName(!view || !view.pinned ? 'pin' : 'unpin') : undefined,
                accelerator: Shortcuts.TAB_PIN,
                click: () => {
                    if (!view) return;
                    view.pinned = !view.pinned;
                }
            },
            {
                label: !view || !view.muted ? languageSection.tab.muteTab : languageSection.tab.unmuteTab,
                icon: !IS_MAC ? getMenuItemIconFromName(`speaker${!view || view.muted ? '' : '_muted'}`) : undefined,
                accelerator: Shortcuts.TAB_MUTE,
                click: () => {
                    if (!view) return;
                    view.muted = !view.muted;
                }
            },
            { type: 'separator' },
            {
                label: languageSection.tab.prevTab,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.TAB_PREVIOUS,
                enabled: viewManager.views.length > 0,
                click: () => {
                    const views = viewManager.views;

                    const index = views.findIndex((appView) => appView.id === viewManager.selectedId);
                    viewManager.select(views[index > 0 ? index - 1 : views.length - 1].id);
                }
            },
            {
                label: languageSection.tab.nextTab,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.TAB_NEXT,
                enabled: viewManager.views.length > 0,
                click: () => {
                    const views = viewManager.views;

                    const index = views.findIndex((appView) => appView.id === viewManager.selectedId);
                    viewManager.select(views[index < (views.length - 1) ? index + 1 : 0].id);
                }
            },
            { type: 'separator' },
            ...(viewManager.views.map((appView, i): MenuItemConstructorOptions => (
                {
                    label: appView.title,
                    icon: !IS_MAC ? (viewManager.selectedId === appView.id ? getMenuItemIconFromName('check') : getFavicon(appView)) : undefined,
                    accelerator: i < 9 ? `CmdOrCtrl+${i + 1}` : undefined,
                    type: !IS_MAC ? 'normal' : 'checkbox',
                    checked: viewManager.selectedId === appView.id,
                    enabled: viewManager.selectedId !== appView.id,
                    click: () => viewManager.select(appView.id)
                }
            )))
        ]
    };

    const windowOptions: MenuItemConstructorOptions = {
        label: `${languageSection.window.label}(&W)`,
        icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
        accelerator: 'Alt+W',
        submenu: [
            {
                label: languageSection.window.addWindow,
                icon: !IS_MAC ? getMenuItemIconFromName('window_add') : undefined,
                accelerator: Shortcuts.WINDOW_ADD,
                click: () => {
                    if (window.user instanceof NormalUser) {
                        Main.windowManager.add(window.user);
                    } else if (window.user instanceof IncognitoUser) {
                        Main.windowManager.add(window.user.fromUser);
                    }
                }
            },
            {
                label: languageSection.window.openIncognitoWindow,
                icon: !IS_MAC ? getMenuItemIconFromName('window_incognito') : undefined,
                accelerator: Shortcuts.WINDOW_INCOGNITO,
                click: () => {
                    if (window.user instanceof NormalUser) {
                        const incognitoUser = Main.userManager.add(new IncognitoUser(window.user));
                        Main.windowManager.add(incognitoUser, undefined);
                    } else if (window.user instanceof IncognitoUser) {
                        const incognitoUser = Main.userManager.add(new IncognitoUser(window.user.fromUser));
                        Main.windowManager.add(incognitoUser, undefined);
                    }
                }
            },
            {
                label: languageSection.window.removeWindow,
                icon: !IS_MAC ? getMenuItemIconFromName('window_remove') : undefined,
                accelerator: Shortcuts.WINDOW_REMOVE,
                click: () => window.close()
            },
            {
                label: languageSection.window.removeOtherWindows,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                enabled: Main.windowManager.getWindows(window.user).filter((appWindow) => appWindow.id !== window.id).length > 0,
                click: () => Main.windowManager.removeOthers(window.id)
            },
            { type: 'separator' },
            {
                label: languageSection.window.minimizeWindow,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                enabled: !window.browserWindow.isFullScreen(),
                click: () => window.browserWindow.minimize()
            },
            {
                label: !window.browserWindow.isMaximized() ? languageSection.window.maximizeWindow : languageSection.window.unmaximizeWindow,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                enabled: !window.browserWindow.isFullScreen(),
                click: () => !window.browserWindow.isMaximized() ? window.browserWindow.maximize() : window.browserWindow.unmaximize()
            },
            {
                label: languageSection.window.toggleFullScreen,
                icon: !IS_MAC ? getMenuItemIconFromName(!window.browserWindow.fullScreen ? 'expand' : 'shrink') : undefined,
                accelerator: Shortcuts.FULLSCREEN,
                click: () => window.browserWindow.setFullScreen(!window.browserWindow.fullScreen)
            },
            { type: 'separator' },
            {
                label: languageSection.window.openProcessManager,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.OPEN_PROCESS_MANAGER,
                click: () => Main.windowManager.openProcessManagerWindow()
            },
            { type: 'separator' },
            ...(Main.windowManager.getWindows(window.user).map((appWindow, i): MenuItemConstructorOptions => {
                const windowViewManager = appWindow.viewManager;
                const subLabel = windowViewManager.views.length - 1 > 0 ? ` とその他 ${windowViewManager.views.length - 1}つのタブ` : '';

                return (
                    {
                        label: `${windowViewManager.get()?.title ?? appWindow.title}${subLabel}`,
                        icon: !IS_MAC ? (window.id === appWindow.id ? getMenuItemIconFromName('check') : getEmptyMenuItemIcon()) : undefined,
                        accelerator: i < 9 ? `CmdOrCtrl+Shift+${i + 1}` : undefined,
                        type: !IS_MAC ? 'normal' : 'checkbox',
                        checked: window.id === appWindow.id,
                        enabled: window.id !== appWindow.id,
                        click: () => Main.windowManager.select(appWindow.id)
                    }
                );
            }))
        ]
    };

    const userOptions: MenuItemConstructorOptions = {
        label: `${languageSection.user.label}(&U)`,
        icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
        accelerator: 'Alt+U',
        submenu: [
            {
                label: languageSection.user.addUser,
                icon: !IS_MAC ? getMenuItemIconFromName('user_add') : undefined,
                click: async () => {
                    const user = await Main.userManager.create();
                    faker.locale = 'ja';
                    user.settings.config = { profile: { name: `${faker.name.lastName()} ${faker.name.firstName()}` } };
                    Main.userManager.lastUserId = user.id;
                    App.setTheme(user.settings.config);
                    Main.windowManager.add(user);
                }
            },
            {
                label: languageSection.user.removeUser,
                icon: !IS_MAC ? getMenuItemIconFromName('user_remove') : undefined,
                click: () => {
                }
            },
            {
                label: languageSection.user.editUser,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                click: () => {
                }
            },
            { type: 'separator' },
            ...(Main.userManager.normalUsers.map((user): MenuItemConstructorOptions => (
                {
                    label: user.name,
                    icon: !IS_MAC ? (window.user.id === user.id ? getMenuItemIconFromName('check') : (user.avatar ? getEmptyMenuItemIcon() : getMenuItemIconFromName('user'))) : undefined,
                    type: !IS_MAC ? 'normal' : 'checkbox',
                    checked: window.user.id === user.id,
                    enabled: window.user.id !== user.id,
                    click: () => {
                        Main.userManager.lastUserId = user.id;
                        App.setTheme(user.settings.config);

                        const windows = Main.windowManager.getWindows(user);
                        if (windows.length > 0) {
                            Main.windowManager.select(windows[0].id);
                        } else {
                            Main.windowManager.add(user);
                        }
                    }
                }
            )))
        ]
    };

    const helpOptions: MenuItemConstructorOptions = {
        label: `${languageSection.help.label}(&H)`,
        icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
        accelerator: 'Alt+H',
        submenu: [
            {
                label: languageSection.help.help,
                icon: !IS_MAC ? getMenuItemIconFromName('help') : undefined,
                accelerator: Shortcuts.HELP,
                click: () => {

                }
            },
            { type: 'separator' },
            {
                label: languageSection.help.feedback,
                icon: !IS_MAC ? getMenuItemIconFromName('feedback') : undefined,
                accelerator: Shortcuts.FEEDBACK,
                click: () => {
                }
            },
            { type: 'separator' },
            {
                label: languageSection.help.openProcessManager,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.OPEN_PROCESS_MANAGER,
                click: () => Main.windowManager.openProcessManagerWindow()
            },
            { type: 'separator' },
            {
                label: languageSection.help.about,
                icon: !IS_MAC ? getMenuItemIcon(getIconsPath('app', 'icon.png')) : undefined,
                click: () => showAboutPanel()
            }
        ]
    };

    return Menu.buildFromTemplate(
        joinTo(
            [
                applicationOptions,
                fileOptions,
                editOptions,
                viewOptions,
                navigationOptions,
                tabOptions,
                windowOptions,
                userOptions,
                helpOptions
            ],
            null
        )
    );
};
