import { getCurrentWebContents, getCurrentWindow } from '@electron/remote';
import { ipcRenderer } from 'electron';
import { IBookmark, IHistory, UserConfig, UserType } from '../../interfaces/user';
import { FindState, MoveDirection, ViewState } from '../../interfaces/view';
import { SearchResult } from '../../main/utils/search';
import { DeepPartial } from '../../utils';

interface ElectronAPI {
    getWindowId: () => number;
    showApplicationMenu: () => Promise<void>;
    toggleSidebar: () => Promise<void>;

    isMinimized: () => Promise<boolean>;
    isMaximized: () => Promise<boolean>;
    isFullScreen: () => Promise<boolean>;
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    fullScreen: () => Promise<void>;
    close: () => Promise<void>;


    getWebContentsId: () => number;
    getViews: () => Promise<ViewState[]>;
    getView: (id: number) => Promise<ViewState>;
    getCurrentView: () => Promise<ViewState>;
    addView: (url: string, active: boolean) => Promise<number>;
    removeView: (id: number) => Promise<void>;
    selectView: (id: number) => Promise<void>;
    moveTo: (id: number, toIndex: number) => Promise<void>;
    moveToDirection: (id: number, direction: MoveDirection) => Promise<void>;
    showTabMenu: (id: number, x: number, y: number) => Promise<void>;

    backView: (id: number) => Promise<void>;
    forwardView: (id: number) => Promise<void>;
    reloadView: (id: number) => Promise<void>;
    stopView: (id: number) => Promise<void>;
    loadView: (id: number, url: string) => Promise<void>;

    hideDialog: () => Promise<void>;
    destroyDialog: () => Promise<void>;

    showMenuPopup: (x: number, y: number) => Promise<void>;

    showInformationPopup: (x: number, y: number) => Promise<void>;

    showSearchPopup: (x: number, y: number, width: number) => Promise<void>;
    search: (keyword: string) => Promise<SearchResult>;

    showFindPopup: () => Promise<void>;
    findInPage: (id: number, text: string, matchCase: boolean) => Promise<FindState>;
    moveFindInPage: (id: number, forward: boolean) => Promise<FindState>;
    stopFindInPage: (id: number, hide: boolean) => Promise<void>;

    showBookmarksPopup: (x: number, y: number) => Promise<void>;
    getBookmarks: (userId: string) => Promise<IBookmark[]>;
    addBookmark: (userId: string, data: Omit<IBookmark, '_id' | 'updatedAt' | 'createdAt'>) => Promise<void>;
    removeBookmark: (userId: string, id: string) => Promise<void>;

    showHistoriesPopup: (x: number, y: number) => Promise<void>;
    getHistories: (userId: string) => Promise<IHistory[]>;
    addHistory: (userId: string, data: Omit<IHistory, '_id' | 'updatedAt' | 'createdAt'>) => Promise<void>;
    removeHistory: (userId: string, id: string) => Promise<void>;

    showDownloadsPopup: (x: number, y: number) => Promise<void>;

    showExtensionsPopup: (x: number, y: number) => Promise<void>;
    showExtensionMenu: (id: string, x: number, y: number) => Promise<void>;


    getCurrentUserId: () => Promise<string>;
    getUserType: (id: string) => Promise<UserType>;
    getUserConfig: (id: string) => Promise<UserConfig>;
    setUserConfig: (id: string, config: DeepPartial<UserConfig>) => Promise<UserConfig>;
}

const windowId = getCurrentWindow().id;
const webContentsId = getCurrentWebContents().id;
export const useElectronAPI = (): ElectronAPI => ({
    getWindowId: () => getCurrentWindow().id,
    showApplicationMenu: () => ipcRenderer.invoke(`window-application_menu-${windowId}`),
    toggleSidebar: () => ipcRenderer.invoke(`window-sidebar-${windowId}`),

    isMinimized: () => ipcRenderer.invoke(`window-minimized-${windowId}`),
    isMaximized: () => ipcRenderer.invoke(`window-maximized-${windowId}`),
    isFullScreen: () => ipcRenderer.invoke(`window-fullscreened-${windowId}`),
    minimize: () => ipcRenderer.invoke(`window-minimize-${windowId}`),
    maximize: () => ipcRenderer.invoke(`window-maximize-${windowId}`),
    fullScreen: () => ipcRenderer.invoke(`window-fullscreen-${windowId}`),
    close: () => ipcRenderer.invoke(`window-close-${windowId}`),


    getWebContentsId: () => getCurrentWebContents().id,
    getViews: () => ipcRenderer.invoke(`views-${windowId}`),
    getView: (id: number) => ipcRenderer.invoke(`view-${windowId}`, id),
    getCurrentView: () => ipcRenderer.invoke(`view-current-${windowId}`),
    addView: (url: string = 'https://www.google.com', active: boolean = true) => ipcRenderer.invoke(`view-create-${windowId}`, url, active),
    removeView: (id: number) => ipcRenderer.invoke(`view-destroy-${windowId}`, id),
    selectView: (id: number) => ipcRenderer.invoke(`view-select-${windowId}`, id),
    moveTo: (id: number, toIndex: number) => ipcRenderer.invoke(`view-move-${windowId}`, id, toIndex),
    moveToDirection: (id: number, direction: MoveDirection) => ipcRenderer.invoke(`view-move_direction-${windowId}`, id, direction),
    showTabMenu: (id: number, x: number, y: number) => ipcRenderer.invoke(`view-menu-${windowId}`, id, x, y),

    backView: (id: number) => ipcRenderer.invoke(`view-back-${windowId}`, id),
    forwardView: (id: number) => ipcRenderer.invoke(`view-forward-${windowId}`, id),
    reloadView: (id: number) => ipcRenderer.invoke(`view-reload-${windowId}`, id),
    stopView: (id: number) => ipcRenderer.invoke(`view-stop-${windowId}`, id),
    loadView: (id: number, url: string) => ipcRenderer.invoke(`view-load-${windowId}`, id, url),

    hideDialog: () => ipcRenderer.invoke(`dialog-hide-${webContentsId}`),
    destroyDialog: () => ipcRenderer.invoke(`dialog-destroy-${webContentsId}`),

    showMenuPopup: (x: number, y: number) => ipcRenderer.invoke(`window-menu-${windowId}`, x, y),

    showInformationPopup: (x: number, y: number) => ipcRenderer.invoke(`window-information-${windowId}`, x, y),

    showSearchPopup: (x: number, y: number, width: number) => ipcRenderer.invoke(`window-show_search-${windowId}`, x, y, width),
    search: (keyword) => ipcRenderer.invoke(`window-search-${windowId}`, keyword),

    showFindPopup: () => ipcRenderer.invoke(`window-find-${windowId}`),
    findInPage: (id: number, text: string, matchCase: boolean) => ipcRenderer.invoke(`view-find_in_page-${windowId}`, id, text, matchCase),
    moveFindInPage: (id: number, forward: boolean) => ipcRenderer.invoke(`view-move_find_in_page-${windowId}`, id, forward),
    stopFindInPage: (id: number, hide: boolean) => ipcRenderer.invoke(`view-stop_find_in_page-${windowId}`, id, hide),

    showBookmarksPopup: (x: number, y: number) => ipcRenderer.invoke(`window-bookmarks-${windowId}`, x, y),
    getBookmarks: (userId: string): Promise<IBookmark[]> => {
        if (!userId) return Promise.resolve([]);
        return ipcRenderer.invoke(`bookmarks-${userId}`);
    },
    addBookmark: (userId: string, data: Omit<IBookmark, '_id' | 'updatedAt' | 'createdAt'>) => {
        if (!userId) return Promise.resolve();
        return ipcRenderer.invoke(`bookmark-add-${userId}`, data);
    },
    removeBookmark: (userId: string, id: string) => {
        if (!userId) return Promise.resolve();
        return ipcRenderer.invoke(`bookmark-remove-${userId}`, id);
    },

    showHistoriesPopup: (x: number, y: number) => ipcRenderer.invoke(`window-histories-${windowId}`, x, y),
    getHistories: (userId: string) => ipcRenderer.invoke(`histories-${userId}`),
    addHistory: (userId: string, data: Omit<IHistory, '_id' | 'updatedAt' | 'createdAt'>) => ipcRenderer.invoke(`history-add-${userId}`, data),
    removeHistory: (userId: string, id: string) => ipcRenderer.invoke(`history-remove-${userId}`, id),

    showDownloadsPopup: (x: number, y: number) => ipcRenderer.invoke(`window-downloads-${windowId}`, x, y),

    showExtensionsPopup: (x: number, y: number) => ipcRenderer.invoke(`window-extensions-${windowId}`, x, y),
    showExtensionMenu: (id: string, x: number, y: number) => ipcRenderer.invoke(`extension-menu-${windowId}`, id, x, y),


    getCurrentUserId: () => ipcRenderer.invoke(`window-user-${windowId}`),
    getUserType: (id: string) => ipcRenderer.invoke('get-user-type', id),
    getUserConfig: (id: string) => ipcRenderer.invoke(`get-user-config`, id),
    setUserConfig: (id: string, config: DeepPartial<UserConfig>) => ipcRenderer.invoke(`set-user-config`, id, config)
});
