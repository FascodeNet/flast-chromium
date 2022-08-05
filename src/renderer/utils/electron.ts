import { getCurrentWebContents, getCurrentWindow } from '@electron/remote';
import { ipcRenderer } from 'electron';
import { BookmarkData, HistoryData, HistoryGroup, OmitData, UserConfig, UserType } from '../../interfaces/user';
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
    getView: (viewId: number) => Promise<ViewState>;
    getCurrentView: () => Promise<ViewState>;
    addView: (url: string, active: boolean) => Promise<number>;
    removeView: (viewId: number) => Promise<void>;
    selectView: (viewId: number) => Promise<void>;
    moveTo: (viewId: number, toIndex: number) => Promise<void>;
    moveToDirection: (viewId: number, direction: MoveDirection) => Promise<void>;
    showTabMenu: (viewId: number, x: number, y: number) => Promise<void>;

    backView: (viewId: number) => Promise<void>;
    forwardView: (viewId: number) => Promise<void>;
    reloadView: (viewId: number) => Promise<void>;
    stopView: (viewId: number) => Promise<void>;
    loadView: (viewId: number, url: string) => Promise<void>;


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
    getBookmarks: (userId: string) => Promise<BookmarkData[]>;
    addBookmark: (userId: string, data: OmitData<BookmarkData>) => Promise<BookmarkData>;
    removeBookmark: (userId: string, bookmarkId: string) => Promise<boolean>;
    updateBookmark: (userId: string, bookmarkId: string, data: OmitData<BookmarkData>) => Promise<BookmarkData>;

    showHistoryPopup: (x: number, y: number) => Promise<void>;
    getHistory: (userId: string) => Promise<HistoryData[]>;
    getHistoryGroups: (userId: string) => Promise<HistoryGroup[]>;
    addHistory: (userId: string, data: OmitData<HistoryData>) => Promise<HistoryData>;
    removeHistory: (userId: string, historyId: string) => Promise<boolean>;

    showDownloadsPopup: (x: number, y: number) => Promise<void>;

    showExtensionsPopup: (x: number, y: number) => Promise<void>;
    showExtensionMenu: (id: string, x: number, y: number) => Promise<void>;


    getCurrentUserId: () => Promise<string>;
    getUserType: (userId: string) => Promise<UserType>;
    getUserConfig: (userId: string) => Promise<UserConfig>;
    setUserConfig: (userId: string, config: DeepPartial<UserConfig>) => Promise<UserConfig>;
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
    getView: (viewId: number) => ipcRenderer.invoke(`view-${windowId}`, viewId),
    getCurrentView: () => ipcRenderer.invoke(`view-current-${windowId}`),
    addView: (url: string, active: boolean = true) => ipcRenderer.invoke(`view-create-${windowId}`, url, active),
    removeView: (viewId: number) => ipcRenderer.invoke(`view-destroy-${windowId}`, viewId),
    selectView: (viewId: number) => ipcRenderer.invoke(`view-select-${windowId}`, viewId),
    moveTo: (viewId: number, toIndex: number) => ipcRenderer.invoke(`view-move-${windowId}`, viewId, toIndex),
    moveToDirection: (viewId: number, direction: MoveDirection) => ipcRenderer.invoke(`view-move_direction-${windowId}`, viewId, direction),
    showTabMenu: (viewId: number, x: number, y: number) => ipcRenderer.invoke(`view-menu-${windowId}`, viewId, x, y),

    backView: (viewId: number) => ipcRenderer.invoke(`view-back-${windowId}`, viewId),
    forwardView: (viewId: number) => ipcRenderer.invoke(`view-forward-${windowId}`, viewId),
    reloadView: (viewId: number) => ipcRenderer.invoke(`view-reload-${windowId}`, viewId),
    stopView: (viewId: number) => ipcRenderer.invoke(`view-stop-${windowId}`, viewId),
    loadView: (viewId: number, url: string) => ipcRenderer.invoke(`view-load-${windowId}`, viewId, url),


    hideDialog: () => ipcRenderer.invoke(`dialog-hide-${webContentsId}`),
    destroyDialog: () => ipcRenderer.invoke(`dialog-destroy-${webContentsId}`),

    showMenuPopup: (x: number, y: number) => ipcRenderer.invoke(`window-menu-${windowId}`, x, y),

    showInformationPopup: (x: number, y: number) => ipcRenderer.invoke(`window-information-${windowId}`, x, y),

    showSearchPopup: (x: number, y: number, width: number) => ipcRenderer.invoke(`window-show_search-${windowId}`, x, y, width),
    search: (keyword: string) => ipcRenderer.invoke(`window-search-${windowId}`, keyword),

    showFindPopup: () => ipcRenderer.invoke(`window-find-${windowId}`),
    findInPage: (id: number, text: string, matchCase: boolean) => ipcRenderer.invoke(`view-find_in_page-${windowId}`, id, text, matchCase),
    moveFindInPage: (id: number, forward: boolean) => ipcRenderer.invoke(`view-move_find_in_page-${windowId}`, id, forward),
    stopFindInPage: (id: number, hide: boolean) => ipcRenderer.invoke(`view-stop_find_in_page-${windowId}`, id, hide),

    showBookmarksPopup: (x: number, y: number) => ipcRenderer.invoke(`window-bookmarks-${windowId}`, x, y),
    getBookmarks: (userId: string): Promise<BookmarkData[]> => {
        if (!userId) return Promise.resolve([]);
        return ipcRenderer.invoke(`bookmarks-${userId}`);
    },
    addBookmark: async (userId: string, data: OmitData<BookmarkData>): Promise<BookmarkData> => {
        if (!userId || !data) return Promise.reject();
        return await ipcRenderer.invoke(`bookmark-add-${userId}`, data);
    },
    removeBookmark: async (userId: string, bookmarkId: string): Promise<boolean> => {
        if (!userId || !bookmarkId) return Promise.resolve(false);
        return await ipcRenderer.invoke(`bookmark-remove-${userId}`, bookmarkId);
    },
    updateBookmark: async (userId: string, bookmarkId: string, data: OmitData<BookmarkData>): Promise<BookmarkData> => {
        if (!userId || !bookmarkId || !data) return Promise.reject();
        return await ipcRenderer.invoke(`bookmark-update-${userId}`, bookmarkId, data);
    },

    showHistoryPopup: (x: number, y: number) => ipcRenderer.invoke(`window-history-${windowId}`, x, y),
    getHistory: (userId: string) => {
        if (!userId) return Promise.resolve();
        return ipcRenderer.invoke(`history-${userId}`);
    },
    getHistoryGroups: (userId: string) => {
        if (!userId) return Promise.resolve();
        return ipcRenderer.invoke(`history-groups-${userId}`);
    },
    addHistory: async (userId: string, data: OmitData<HistoryData>): Promise<HistoryData> => {
        if (!userId || !data) return Promise.reject();
        return await ipcRenderer.invoke(`history-add-${userId}`, data);
    },
    removeHistory: async (userId: string, historyId: string): Promise<boolean> => {
        if (!userId || !historyId) return false;
        return await ipcRenderer.invoke(`history-remove-${userId}`, historyId);
    },

    showDownloadsPopup: (x: number, y: number) => ipcRenderer.invoke(`window-downloads-${windowId}`, x, y),

    showExtensionsPopup: (x: number, y: number) => ipcRenderer.invoke(`window-extensions-${windowId}`, x, y),
    showExtensionMenu: (id: string, x: number, y: number) => ipcRenderer.invoke(`extension-menu-${windowId}`, id, x, y),


    getCurrentUserId: () => ipcRenderer.invoke(`window-user-${windowId}`),
    getUserType: (userId: string) => ipcRenderer.invoke('get-user-type', userId),
    getUserConfig: (userId: string) => ipcRenderer.invoke(`get-user-config`, userId),
    setUserConfig: (userId: string, config: DeepPartial<UserConfig>) => ipcRenderer.invoke(`set-user-config`, userId, config)
});
