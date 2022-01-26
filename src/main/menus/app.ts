import { app, Menu, MenuItemConstructorOptions } from 'electron';
import { getTranslate } from '../../languages/language';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_SETTINGS } from '../../utils';
import { IS_MAC } from '../../utils/process';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { IncognitoUser } from '../user/incognito';
import { NormalUser } from '../user/normal';
import { getEmptyMenuItemIcon, getMenuItemIcon, getMenuItemIconFromName, joinTo } from '../utils/menu';
import { Shortcuts } from './shortcuts';

export const getApplicationMenu = (user: IUser) => {
    const translate = getTranslate(user.settings.config);
    const languageSection = translate.menus.window;

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
                label: languageSection.file.newWindow,
                icon: !IS_MAC ? getMenuItemIconFromName('window_add') : undefined,
                accelerator: Shortcuts.WINDOW_ADD,
                click: () => {
                    if (user instanceof NormalUser) {
                        Main.windowManager.add(user);
                    } else if (user instanceof IncognitoUser) {
                        Main.windowManager.add(user.fromUser);
                    }
                }
            },
            {
                label: languageSection.file.openIncognitoWindow,
                icon: !IS_MAC ? getMenuItemIconFromName('window_incognito') : undefined,
                accelerator: Shortcuts.WINDOW_INCOGNITO,
                click: () => {
                    if (user instanceof NormalUser) {
                        const incognitoUser = Main.userManager.add(new IncognitoUser(user));
                        Main.windowManager.add(incognitoUser, undefined);
                    } else if (user instanceof IncognitoUser) {
                        const incognitoUser = Main.userManager.add(new IncognitoUser(user.fromUser));
                        Main.windowManager.add(incognitoUser, undefined);
                    }
                }
            },
            { type: 'separator' },
            {
                label: languageSection.file.settings,
                icon: !IS_MAC ? getMenuItemIconFromName('settings') : undefined,
                accelerator: Shortcuts.SETTINGS,
                click: () => {
                    const url = `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_SETTINGS}`;

                    if (user instanceof NormalUser) {
                        Main.windowManager.add(user, [url]);
                    } else if (user instanceof IncognitoUser) {
                        Main.windowManager.add(user.fromUser, [url]);
                    }
                }
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
                helpOptions
            ],
            null
        )
    );
};
