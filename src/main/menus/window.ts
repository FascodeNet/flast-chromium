import { app, dialog, Menu, MenuItemConstructorOptions, nativeImage } from 'electron';
import { getTranslate } from '../../languages/language';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_SETTINGS } from '../../utils';
import { isHorizontal } from '../../utils/design';
import { IS_MAC } from '../../utils/process';
import { Main } from '../main';
import { IncognitoUser } from '../user/incognito';
import { NormalUser } from '../user/normal';
import { getEmptyMenuItemIcon, getMenuItemIcon, getMenuItemIconFromName, joinTo, resizeIcon } from '../utils/menu';
import { AppView } from '../views/app';
import { AppWindow } from '../windows/app';
import { Shortcuts } from './shortcuts';

export const getWindowMenu = (window: AppWindow) => {
    const translate = getTranslate(window.user.settings.config);
    const languageSection = translate.menus.application;

    const viewManager = window.viewManager;

    const getFavicon = (view: AppView) => {
        let dataURL = view.getFavicon();
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

    const applicationOptions: MenuItemConstructorOptions | undefined = IS_MAC ? {
        label: languageSection.app.label,
        icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
        submenu: [
            {
                label: languageSection.app.about,
                role: 'about'
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
                    const view = viewManager.get();
                    if (!view) return;

                    dialog.showSaveDialog({
                        defaultPath: `${app.getPath('downloads')}/${view.getTitle()}`,
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
                    const view = viewManager.get();
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

                    const view = viewManager.get();
                    if (!view) {
                        viewManager.add(url);
                        return;
                    }

                    if (new URL(view.getURL()).protocol === `${APPLICATION_PROTOCOL}:`) {
                        view.load(url);
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
                click: () => {
                    if (viewManager.views.size > 1) {
                        viewManager.remove();
                    } else {
                        window.close();
                    }
                }
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
                /*
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    view.webContents.undo();
                }
                */
            },
            {
                label: languageSection.edit.redo,
                icon: !IS_MAC ? getMenuItemIconFromName('redo') : undefined,
                accelerator: Shortcuts.EDIT_REDO,
                role: 'redo'
                /*
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    view.webContents.redo();
                }
                */
            },
            { type: 'separator' },
            {
                label: languageSection.edit.cut,
                icon: !IS_MAC ? getMenuItemIconFromName('cut') : undefined,
                accelerator: Shortcuts.EDIT_CUT,
                role: 'cut'
                /*
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    view.webContents.cut();
                }
                */
            },
            {
                label: languageSection.edit.copy,
                icon: !IS_MAC ? getMenuItemIconFromName('copy') : undefined,
                accelerator: Shortcuts.EDIT_COPY,
                role: 'copy'
                /*
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    view.webContents.copy();
                }
                */
            },
            {
                label: languageSection.edit.paste,
                icon: !IS_MAC ? getMenuItemIconFromName('paste') : undefined,
                accelerator: Shortcuts.EDIT_PASTE,
                role: 'pasteAndMatchStyle'
                /*
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    view.webContents.pasteAndMatchStyle();
                }
                */
            },
            {
                label: languageSection.edit.pastePlainText,
                icon: !IS_MAC ? getMenuItemIconFromName('paste_as_plain_text') : undefined,
                accelerator: Shortcuts.EDIT_PASTE_AS_PLAIN_TEXT,
                role: 'paste'
                /*
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    view.webContents.paste();
                }
                */
            },
            {
                label: languageSection.edit.delete,
                icon: !IS_MAC ? getMenuItemIconFromName('backspace') : undefined,
                accelerator: Shortcuts.EDIT_DELETE,
                role: 'delete'
                /*
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    view.webContents.delete();
                }
                */
            },
            { type: 'separator' },
            {
                label: languageSection.edit.selectAll,
                icon: !IS_MAC ? getMenuItemIconFromName('select_all') : undefined,
                accelerator: Shortcuts.EDIT_SELECT_ALL,
                role: 'selectAll'
                /*
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    view.webContents.selectAll();
                }
                */
            },
            { type: 'separator' },
            {
                label: languageSection.edit.find,
                icon: !IS_MAC ? getMenuItemIconFromName('search') : undefined,
                accelerator: Shortcuts.FIND_1,
                click: () => {
                    const view = viewManager.get();
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
                    const view = viewManager.get();
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
                icon: !IS_MAC ? getMenuItemIconFromName('fullscreen') : undefined,
                accelerator: Shortcuts.FULLSCREEN,
                click: () => {
                    const window = Main.windowManager.get();
                    if (!window) return;

                    window.browserWindow.setFullScreen(!window.browserWindow.fullScreen);
                }
            },
            {
                label: languageSection.view.toolbar,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.TOOLBAR,
                enabled: window.browserWindow.isFullScreen() && window.fullScreenState.user && !window.fullScreenState.html,
                click: () => {
                    const settings = window.user.settings;

                    settings.config = { appearance: { fullscreen_showing_toolbar: !settings.config.appearance.fullscreen_showing_toolbar } };

                    const windows = Main.windowManager.getWindows().filter((appWindow) => appWindow.user.id === window.user.id);
                    windows.forEach((window) => {
                        window.webContents.send('settings-update', settings.config);
                        window.viewManager.get()?.setBounds();
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

                    const windows = Main.windowManager.getWindows().filter((appWindow) => appWindow.user.id === window.user.id);
                    windows.forEach((window) => {
                        window.webContents.send('settings-update', settings.config);
                        window.viewManager.get()?.setBounds();
                    });
                }
            },
            { type: 'separator' },
            {
                label: languageSection.view.zoomIn,
                icon: !IS_MAC ? getMenuItemIconFromName('zoom_in') : undefined,
                accelerator: Shortcuts.ZOOM_IN_1,
                click: () => {
                    const view = viewManager.get();
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
                    const view = viewManager.get();
                    if (!view) return;

                    view.zoomIn();
                }
            },
            {
                label: languageSection.view.zoomOut,
                icon: !IS_MAC ? getMenuItemIconFromName('zoom_out') : undefined,
                accelerator: Shortcuts.ZOOM_OUT_1,
                click: () => {
                    const view = viewManager.get();
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
                    const view = viewManager.get();
                    if (!view) return;

                    view.zoomOut();
                }
            },
            {
                label: languageSection.view.zoomReset,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.ZOOM_RESET_1,
                click: () => {
                    const view = viewManager.get();
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
                    const view = viewManager.get();
                    if (!view) return;

                    view.zoomReset();
                }
            },
            { type: 'separator' },
            {
                label: languageSection.view.viewSource,
                icon: !IS_MAC ? getMenuItemIconFromName('view_source') : undefined,
                accelerator: Shortcuts.VIEW_SOURCE,
                enabled: !viewManager.get()?.getURL().startsWith('view-source:'),
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    const appView = viewManager.add('about:blank');
                    appView.load(`view-source:${view.getURL()}`);
                }
            },
            {
                label: languageSection.view.devTool,
                icon: !IS_MAC ? getMenuItemIconFromName('inspect') : undefined,
                accelerator: Shortcuts.DEVELOPER_TOOLS_1,
                click: () => {
                    const view = viewManager.get();
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
                    const view = viewManager.get();
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
                click: () => {
                    const window = Main.windowManager.get();
                    if (!window) return;
                    window.browserWindow.webContents.openDevTools({ mode: 'detach' });
                }
            }
        ]
    };

    const navigationOptions: MenuItemConstructorOptions = {
        label: `${languageSection.navigation.label}(&N)`,
        icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
        accelerator: 'Alt+N',
        submenu: [
            {
                label: languageSection.navigation.back,
                icon: !IS_MAC ? getMenuItemIconFromName('arrow_left') : undefined,
                accelerator: Shortcuts.NAVIGATION_BACK,
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    view.back();
                }
            },
            {
                label: languageSection.navigation.forward,
                icon: !IS_MAC ? getMenuItemIconFromName('arrow_right') : undefined,
                accelerator: Shortcuts.NAVIGATION_FORWARD,
                click: () => {
                    const view = viewManager.get();
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
                    const view = viewManager.get();
                    if (!view) return;

                    !view.isLoading() ? view.reload() : view.stop();
                }
            },
            {
                label: languageSection.navigation.reload,
                icon: !IS_MAC ? getMenuItemIconFromName('reload') : undefined,
                accelerator: Shortcuts.NAVIGATION_RELOAD_2,
                visible: false,
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    !view.isLoading() ? view.reload() : view.stop();
                }
            },
            {
                label: languageSection.navigation.reloadIgnoringCache,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.NAVIGATION_RELOAD_IGNORING_CACHE,
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    !view.isLoading() ? view.reload(true) : view.stop();
                }
            },
            { type: 'separator' },
            {
                label: languageSection.navigation.home,
                icon: !IS_MAC ? getMenuItemIconFromName('home') : undefined,
                accelerator: Shortcuts.NAVIGATION_HOME,
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    view.load('https://www.google.com');
                }
            },
            { type: 'separator' },
            {
                label: languageSection.navigation.bookmarks,
                icon: !IS_MAC ? getMenuItemIconFromName('bookmarks') : undefined,
                accelerator: Shortcuts.NAVIGATION_BOOKMARKS,
                click: () => {
                }
            },
            {
                label: languageSection.navigation.history,
                icon: !IS_MAC ? getMenuItemIconFromName('history') : undefined,
                accelerator: Shortcuts.NAVIGATION_HISTORY,
                click: () => {
                }
            },
            {
                label: languageSection.navigation.downloads,
                icon: !IS_MAC ? getMenuItemIconFromName('downloads') : undefined,
                accelerator: Shortcuts.NAVIGATION_DOWNLOADS,
                click: () => {
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
                    const view = viewManager.add();
                    viewManager.select(view.id);
                }
            },
            {
                label: languageSection.tab.removeTab,
                icon: !IS_MAC ? getMenuItemIconFromName('tab_remove') : undefined,
                accelerator: Shortcuts.TAB_REMOVE,
                click: () => {
                    if (viewManager.views.size > 1) {
                        viewManager.remove();
                    } else {
                        window.close();
                    }
                }
            },
            {
                label: languageSection.tab.removeOtherTabs,
                icon: !IS_MAC ? getMenuItemIconFromName('tab_remove_all') : undefined,
                enabled: viewManager.getViews().filter((v) => v.id !== viewManager.selectedId).length > 0,
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    viewManager.removeOthers(view.id);
                }
            },
            {
                label: languageSection.tab.removeLeftTabs,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                enabled: viewManager.getLeftViews(viewManager.selectedId).length > 0,
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    viewManager.removeLefts(view.id);
                }
            },
            {
                label: languageSection.tab.removeRightTabs,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                enabled: viewManager.getRightViews(viewManager.selectedId).length > 0,
                click: () => {
                    const view = viewManager.get();
                    if (!view) return;

                    viewManager.removeRights(view.id);
                }
            },
            { type: 'separator' },
            {
                label: languageSection.tab.prevTab,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.TAB_PREVIOUS,
                enabled: viewManager.views.size > 0,
                click: () => {
                    const views = [...viewManager.getViews()];

                    const index = views.findIndex((view) => view.id === viewManager.selectedId);
                    viewManager.select(views[index > 0 ? index - 1 : views.length - 1].id);
                }
            },
            {
                label: languageSection.tab.nextTab,
                icon: !IS_MAC ? getEmptyMenuItemIcon() : undefined,
                accelerator: Shortcuts.TAB_NEXT,
                enabled: viewManager.views.size > 0,
                click: () => {
                    const views = [...viewManager.getViews()];

                    const index = views.findIndex((view) => view.id === viewManager.selectedId);
                    viewManager.select(views[index < (views.length - 1) ? index + 1 : 0].id);
                }
            },
            { type: 'separator' },
            ...(viewManager.getViews().map((appView): MenuItemConstructorOptions => (
                {
                    label: appView.getTitle(),
                    icon: !IS_MAC ? (viewManager.selectedId === appView.id ? getMenuItemIconFromName('check') : getFavicon(appView)) : undefined,
                    // type: 'checkbox',
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
            {
                label: languageSection.file.closeWindow,
                icon: !IS_MAC ? getMenuItemIconFromName('window_remove') : undefined,
                accelerator: Shortcuts.WINDOW_REMOVE,
                click: () => window.close()
            },
            { type: 'separator' },
            ...(Main.windowManager.getWindows().map((appWindow): MenuItemConstructorOptions => {
                const windowViewManager = appWindow.viewManager;
                const subLabel = windowViewManager.views.size - 1 > 0 ? ` とその他 ${windowViewManager.views.size - 1}つのタブ` : '';

                return (
                    {
                        label: `${windowViewManager.get()?.getTitle() ?? appWindow.getTitle()}${subLabel}`,
                        icon: !IS_MAC ? (window.id === appWindow.id ? getMenuItemIconFromName('check') : getEmptyMenuItemIcon()) : undefined,
                        // type: 'checkbox',
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
                label: languageSection.user.add,
                icon: !IS_MAC ? getMenuItemIconFromName('window_add') : undefined,
                click: () => {
                    if (window.user instanceof NormalUser) {
                        Main.windowManager.add(window.user);
                    } else if (window.user instanceof IncognitoUser) {
                        Main.windowManager.add(window.user.fromUser);
                    }
                }
            },
            {
                label: languageSection.user.remove,
                icon: !IS_MAC ? getMenuItemIconFromName('window_incognito') : undefined,
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
                label: languageSection.user.edit,
                icon: !IS_MAC ? getMenuItemIconFromName('window_remove') : undefined,
                click: () => window.close()
            },
            { type: 'separator' },
            ...(Main.userManager.normalUsers.map((user): MenuItemConstructorOptions => (
                {
                    label: user.name,
                    icon: !IS_MAC ? (window.user.id === user.id ? getMenuItemIconFromName('check') : getEmptyMenuItemIcon()) : undefined,
                    // type: 'checkbox',
                    enabled: window.user.id !== user.id,
                    click: () => {
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
                icon: !IS_MAC ? getMenuItemIcon(`${app.getAppPath()}/static/icons/app/icon.png`) : undefined,
                click: () => {
                }
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
