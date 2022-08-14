import { getCurrentWebContents, getCurrentWindow, nativeTheme } from '@electron/remote';
import { Theme } from '@mui/material';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { IPCChannel } from '../../constants/ipc';
import {
    BookmarkData,
    DownloadData,
    HistoryData,
    HistoryGroup,
    NativeDownloadData,
    OmitData,
    UserConfig,
    UserType
} from '../../interfaces/user';
import { FindState, MoveDirection, ViewState, ZoomLevel } from '../../interfaces/view';
import { SearchResult } from '../../main/utils/search';
import { DeepPartial } from '../../utils';
import { MuiDarkGlobalStyles, MuiLightGlobalStyles } from '../themes';

const windowsApi = {
    add: (userId: string, urls: string[] = []): Promise<number> => ipcRenderer.invoke(IPCChannel.Windows.ADD(), userId, urls),
    openIncognito: (userId: string): Promise<number> => ipcRenderer.invoke(IPCChannel.Windows.OPEN_INCOGNITO(), userId)
} as const;

const windowId = getCurrentWindow().id;
const windowApi = {
    getId: (): number => getCurrentWindow().id,

    showApplicationMenu: (): Promise<void> => ipcRenderer.invoke(IPCChannel.Window.APPLICATION_MENU(windowId)),
    toggleSidebar: (): Promise<void> => ipcRenderer.invoke(IPCChannel.Window.SIDEBAR(windowId)),

    isMinimized: (): Promise<boolean> => ipcRenderer.invoke(IPCChannel.Window.IS_MINIMIZED(windowId)),
    isMaximized: (): Promise<boolean> => ipcRenderer.invoke(IPCChannel.Window.IS_MAXIMIZED(windowId)),
    isFullscreen: (): Promise<boolean> => ipcRenderer.invoke(IPCChannel.Window.IS_FULLSCREEN(windowId)),

    minimize: (): Promise<void> => ipcRenderer.invoke(IPCChannel.Window.MINIMIZE(windowId)),
    maximize: (): Promise<void> => ipcRenderer.invoke(IPCChannel.Window.MAXIMIZE(windowId)),
    fullscreen: (): Promise<void> => ipcRenderer.invoke(IPCChannel.Window.FULLSCREEN(windowId)),

    close: (): Promise<void> => ipcRenderer.invoke(IPCChannel.Window.CLOSE(windowId))
} as const;

const viewsApi = {
    getViews: (): Promise<ViewState[]> => ipcRenderer.invoke(IPCChannel.Views.LIST(windowId)),
    getView: (viewId: number): Promise<ViewState> => ipcRenderer.invoke(IPCChannel.Views.GET(windowId), viewId),
    getCurrentView: (): Promise<ViewState> => ipcRenderer.invoke(IPCChannel.Views.GET_CURRENT(windowId)),

    add: (url: string, active: boolean = true): Promise<number> => ipcRenderer.invoke(IPCChannel.Views.ADD(windowId), url, active),
    remove: (viewId: number): Promise<void> => ipcRenderer.invoke(IPCChannel.Views.REMOVE(windowId), viewId),
    select: (viewId: number): Promise<void> => ipcRenderer.invoke(IPCChannel.Views.SELECT(windowId), viewId),

    moveTo: (viewId: number, toIndex: number): Promise<void> => ipcRenderer.invoke(IPCChannel.Views.MOVE(windowId), viewId, toIndex),
    moveToDirection: (viewId: number, direction: MoveDirection): Promise<void> => ipcRenderer.invoke(IPCChannel.Views.MOVE_DIRECTION(windowId), viewId, direction)
} as const;

const viewApi = {
    getId: (): number => getCurrentWebContents().id,

    showTabMenu: (viewId: number, x: number, y: number): Promise<void> => ipcRenderer.invoke(IPCChannel.View.TAB_MENU(viewId), x, y),

    back: (viewId: number): Promise<void> => ipcRenderer.invoke(IPCChannel.View.BACK(viewId)),
    forward: (viewId: number): Promise<void> => ipcRenderer.invoke(IPCChannel.View.FORWARD(viewId)),
    reload: (viewId: number, ignoringCache: boolean = false): Promise<void> => ipcRenderer.invoke(IPCChannel.View.RELOAD(viewId), ignoringCache),
    stop: (viewId: number): Promise<void> => ipcRenderer.invoke(IPCChannel.View.STOP(viewId)),
    load: (viewId: number, url: string): Promise<void> => ipcRenderer.invoke(IPCChannel.View.LOAD(viewId), url),

    zoomIn: (viewId: number): Promise<ZoomLevel> => ipcRenderer.invoke(IPCChannel.View.ZOOM_IN(viewId)),
    zoomOut: (viewId: number): Promise<ZoomLevel> => ipcRenderer.invoke(IPCChannel.View.ZOOM_OUT(viewId)),
    zoomReset: (viewId: number): Promise<ZoomLevel> => ipcRenderer.invoke(IPCChannel.View.ZOOM_RESET(viewId))
} as const;

const dialogApi = {
    hide: (): Promise<void> => ipcRenderer.invoke(IPCChannel.Dialog.HIDE(getCurrentWebContents().id)),
    destroy: (): Promise<void> => ipcRenderer.invoke(IPCChannel.Dialog.DESTROY(getCurrentWebContents().id))
} as const;

const popupApi = {
    windowMenu: (x: number, y: number): Promise<void> => ipcRenderer.invoke(IPCChannel.Popup.WINDOW_MENU(windowId), x, y),

    search: (x: number, y: number, width: number): Promise<void> => ipcRenderer.invoke(IPCChannel.Popup.SEARCH(windowId), x, y, width),

    viewInformation: (x: number, y: number): Promise<void> => ipcRenderer.invoke(IPCChannel.Popup.VIEW_INFORMATION(windowId), x, y),
    viewFind: (): Promise<void> => ipcRenderer.invoke(IPCChannel.Popup.VIEW_FIND(windowId)),

    bookmarks: (x: number, y: number): Promise<void> => ipcRenderer.invoke(IPCChannel.Popup.BOOKMARKS(windowId), x, y),
    history: (x: number, y: number): Promise<void> => ipcRenderer.invoke(IPCChannel.Popup.HISTORY(windowId), x, y),
    downloads: (x: number, y: number): Promise<void> => ipcRenderer.invoke(IPCChannel.Popup.DOWNLOADS(windowId), x, y),
    extensions: (x: number, y: number): Promise<void> => ipcRenderer.invoke(IPCChannel.Popup.EXTENSIONS(windowId), x, y)
} as const;

const findApi = {
    start: (viewId: number, text: string, matchCase: boolean): Promise<FindState> => ipcRenderer.invoke(IPCChannel.Find.START(viewId), text, matchCase),
    stop: (viewId: number, action: 'clearSelection' | 'keepSelection' | 'activateSelection', hideDialog: boolean = true): Promise<void> => ipcRenderer.invoke(IPCChannel.Find.STOP(viewId), action, hideDialog),
    move: (viewId: number, forward: boolean = true): Promise<FindState> => ipcRenderer.invoke(IPCChannel.Find.MOVE(viewId), forward)
} as const;

const bookmarksApi = {
    list: (userId: string): Promise<BookmarkData[]> => {
        if (!userId) return Promise.resolve([]);
        return ipcRenderer.invoke(IPCChannel.Bookmarks.LIST(userId));
    },
    add: (userId: string, data: OmitData<BookmarkData>): Promise<BookmarkData> => {
        if (!userId || !data) return Promise.reject();
        return ipcRenderer.invoke(IPCChannel.Bookmarks.ADD(userId), data);
    },
    remove: (userId: string, bookmarkId: string): Promise<boolean> => {
        if (!userId || !bookmarkId) return Promise.resolve(false);
        return ipcRenderer.invoke(IPCChannel.Bookmarks.REMOVE(userId), bookmarkId);
    },
    update: (userId: string, bookmarkId: string, data: OmitData<BookmarkData>): Promise<BookmarkData> => {
        if (!userId || !bookmarkId || !data) return Promise.reject();
        return ipcRenderer.invoke(IPCChannel.Bookmarks.UPDATE(userId), bookmarkId, data);
    }
} as const;

const historyApi = {
    list: (userId: string): Promise<HistoryData[]> => {
        if (!userId) return Promise.resolve([]);
        return ipcRenderer.invoke(IPCChannel.History.LIST(userId));
    },
    listGroups: (userId: string): Promise<HistoryGroup[]> => {
        if (!userId) return Promise.resolve([]);
        return ipcRenderer.invoke(IPCChannel.History.LIST_GROUPS(userId));
    },
    add: (userId: string, data: OmitData<HistoryData>): Promise<HistoryData> => {
        if (!userId || !data) return Promise.reject();
        return ipcRenderer.invoke(IPCChannel.History.ADD(userId), data);
    },
    remove: (userId: string, historyId: string): Promise<boolean> => {
        if (!userId || !historyId) return Promise.resolve(false);
        return ipcRenderer.invoke(IPCChannel.History.REMOVE(userId), historyId);
    }
} as const;

const downloadsApi = {
    list: (userId: string): Promise<Required<DownloadData>[]> => {
        if (!userId) return Promise.resolve([]);
        return ipcRenderer.invoke(IPCChannel.Downloads.LIST(userId));
    },
    listWithFileIcon: (userId: string): Promise<NativeDownloadData[]> => {
        if (!userId) return Promise.resolve([]);
        return ipcRenderer.invoke(IPCChannel.Downloads.LIST_WITH_FILE_ICON(userId));
    },
    pause: (downloadId: string): Promise<void> => {
        if (!downloadId) return Promise.resolve();
        return ipcRenderer.invoke(IPCChannel.Downloads.PAUSE(downloadId));
    },
    resume: (downloadId: string): Promise<void> => {
        if (!downloadId) return Promise.resolve();
        return ipcRenderer.invoke(IPCChannel.Downloads.RESUME(downloadId));
    },
    cancel: (downloadId: string): Promise<void> => {
        if (!downloadId) return Promise.resolve();
        return ipcRenderer.invoke(IPCChannel.Downloads.CANCEL(downloadId));
    }
} as const;

const webContentsId = getCurrentWebContents().id;
export const useElectronAPI = () => ({
    windowsApi,
    windowApi,
    viewsApi,
    viewApi,
    dialogApi,

    popupApi,

    findApi,

    bookmarksApi,
    historyApi,
    downloadsApi,

    search: (keyword: string): Promise<SearchResult> => ipcRenderer.invoke(`window-search-${windowId}`, keyword),

    showExtensionMenu: (id: string, x: number, y: number): Promise<void> => ipcRenderer.invoke(`extension-menu-${windowId}`, id, x, y),

    getCurrentUserId: (): Promise<string> => ipcRenderer.invoke(`window-user-${windowId}`),
    getUserType: (userId: string): Promise<UserType> => ipcRenderer.invoke(IPCChannel.User.TYPE(userId)),
    getUserConfig: (userId: string): Promise<UserConfig> => ipcRenderer.invoke(IPCChannel.User.GET_CONFIG(userId)),
    setUserConfig: (userId: string, config: DeepPartial<UserConfig>): Promise<UserConfig> => ipcRenderer.invoke(IPCChannel.User.SET_CONFIG(userId), config)
});


export const useNativeTheme = () => {
    const [theme, setTheme] = useState<Theme>(MuiLightGlobalStyles);

    useEffect(() => {
        setTheme(nativeTheme.shouldUseDarkColors ? MuiDarkGlobalStyles : MuiLightGlobalStyles);

        nativeTheme.on('updated', () => {
            setTheme(nativeTheme.shouldUseDarkColors ? MuiDarkGlobalStyles : MuiLightGlobalStyles);
        });

        return () => {
            nativeTheme.removeAllListeners();
        };
    }, []);

    return theme;
};
