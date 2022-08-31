import { Menu, MenuItem } from 'electron';
import { BrowserActionAPI } from 'electron-chrome-extensions-production/dist/browser/api/browser-action';
import { ContextMenusAPI } from 'electron-chrome-extensions-production/dist/browser/api/context-menus';
import { IExtension } from '../../interfaces/extension';
import { getTranslate } from '../../languages/language';
import { AppWindow } from '../windows/app';

type ContextItemProps = chrome.contextMenus.CreateProperties & { id: string }

interface ExtensionAction {
    color?: string;
    text?: string;
    title?: string;
    icon?: chrome.browserAction.TabIconDetails;
    popup?: string;
    /** Last modified date for icon. */
    iconModified?: number;
}

interface ExtensionActionStore extends Partial<ExtensionAction> {
    tabs: { [key: string]: ExtensionAction };
}

export const getExtensionMenu = ({ id, name, url, manifest }: IExtension, window: AppWindow) => {
    const translate = getTranslate(window.user.settings.config);

    const viewManager = window.viewManager;
    const contextMenus: ContextMenusAPI = (window.user.session.extensions as any).api.contextMenus;
    const menuItems: MenuItem[] = (contextMenus as any).buildMenuItemsForExtension(id, 'all');

    const browserAction: BrowserActionAPI = (window.user.session.extensions as any).api.browserAction;
    const actionMap: Map<string, ExtensionActionStore> = (browserAction as any).actionMap;

    console.log(actionMap.get(id));

    const optionPage = manifest.options_page ?? manifest.options_ui?.page;
    const optionPageUrl = optionPage ? `${url}/${optionPage}` : undefined;

    const languageSection = translate.menus.tab;
    return Menu.buildFromTemplate(
        [
            {
                label: name,
                click: () => viewManager.add(`https://chrome.google.com/webstore/detail/${id}`)
            },
            { type: 'separator' },
            ...menuItems,
            { type: 'separator' },
            {
                label: 'オプション',
                enabled: optionPage !== undefined && optionPageUrl !== undefined,
                click: () => {
                    if (!optionPage || !optionPageUrl) return;

                    const appView = window.viewManager.add('about:blank');
                    appView.load(optionPageUrl);
                    appView.browserView.webContents.clearHistory();
                }
            }
        ]
    );
};
