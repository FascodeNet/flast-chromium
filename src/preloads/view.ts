import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IBookmarksAPI, IDownloadsAPI, IFlastAPI, IHistoryAPI } from '../@types/electron';
import { APPLICATION_PROTOCOL } from '../constants';
import { IPCChannel } from '../constants/ipc';
import { BookmarkData, DataGroup, DownloadData, HistoryData, OmitData, UserConfig } from '../interfaces/user';
import { DeepPartial } from '../utils';
import { injectChromeWebStoreInstallButton } from './chrome-webstore';

export const togglePictureInPicture = async (index: number = 0) => {
    if (!document.pictureInPictureEnabled)
        throw Error('Picture in Picture is disabled!');

    if (!document.pictureInPictureElement) {
        const elements = document.querySelectorAll('video');
        if (elements.length > 0 && elements.length > index && index >= 0 && elements[index]) {
            const element = elements[index];
            if (element.disablePictureInPicture)
                throw Error('Picture in Picture is disabled!');

            await element.requestPictureInPicture();
            return;
        } else {
            throw Error('Video Element Not found.');
        }
    } else {
        await document.exitPictureInPicture();
        return;
    }
};


const bookmarksApi: IBookmarksAPI = {
    list: (userId: string): Promise<Required<BookmarkData>[]> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId) return Promise.resolve([]);
        return ipcRenderer.invoke(IPCChannel.Bookmarks.LIST(userId));
    },
    add: (userId: string, data: OmitData<BookmarkData>): Promise<Required<BookmarkData>> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId || !data) return Promise.reject();
        return ipcRenderer.invoke(IPCChannel.Bookmarks.ADD(userId), data);
    },
    remove: (userId: string, bookmarkId: string): Promise<boolean> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId || !bookmarkId) return Promise.resolve(false);
        return ipcRenderer.invoke(IPCChannel.Bookmarks.REMOVE(userId), bookmarkId);
    },
    update: (userId: string, bookmarkId: string, data: OmitData<BookmarkData>): Promise<Required<BookmarkData>> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId || !bookmarkId || !data) return Promise.reject();
        return ipcRenderer.invoke(IPCChannel.Bookmarks.UPDATE(userId), bookmarkId, data);
    }
} as const;

const historyApi: IHistoryAPI = {
    list: (userId: string): Promise<Required<HistoryData>[]> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId) return Promise.resolve([]);
        return ipcRenderer.invoke(IPCChannel.History.LIST(userId));
    },
    listGroups: (userId: string): Promise<DataGroup<Required<HistoryData>>[]> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId) return Promise.resolve([]);
        return ipcRenderer.invoke(IPCChannel.History.LIST_GROUPS(userId));
    }
} as const;

const downloadsApi: IDownloadsAPI = {
    list: (userId: string): Promise<Required<DownloadData>[]> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId) return Promise.resolve([]);
        return ipcRenderer.invoke(IPCChannel.Downloads.LIST(userId));
    },
    listGroups: (userId: string): Promise<DataGroup<Required<DownloadData>>[]> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId) return Promise.resolve([]);
        return ipcRenderer.invoke(IPCChannel.Downloads.LIST_GROUPS(userId));
    },

    openFile: (userId: string, downloadId: string): Promise<void> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId || !downloadId) return Promise.resolve();
        return ipcRenderer.invoke(IPCChannel.Downloads.OPEN_FILE(userId), downloadId);
    },
    openFolder: (userId: string, downloadId: string): Promise<void> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId || !downloadId) return Promise.resolve();
        return ipcRenderer.invoke(IPCChannel.Downloads.OPEN_FOLDER(userId), downloadId);
    },
    pause: (userId: string, downloadId: string): Promise<void> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId || !downloadId) return Promise.resolve();
        return ipcRenderer.invoke(IPCChannel.Downloads.PAUSE(userId), downloadId);
    },
    resume: (userId: string, downloadId: string): Promise<void> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId || !downloadId) return Promise.resolve();
        return ipcRenderer.invoke(IPCChannel.Downloads.RESUME(userId), downloadId);
    },
    cancel: (userId: string, downloadId: string): Promise<void> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId || !downloadId) return Promise.resolve();
        return ipcRenderer.invoke(IPCChannel.Downloads.CANCEL(userId), downloadId);
    },
    retry: (userId: string, downloadId: string): Promise<void> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId || !downloadId) return Promise.resolve();
        return ipcRenderer.invoke(IPCChannel.Downloads.RETRY(userId), downloadId);
    },

    onUpdated: (downloadId: string, callback: (e: IpcRendererEvent, data: Required<DownloadData>) => void) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !downloadId || !callback) return;
        return ipcRenderer.on(IPCChannel.Downloads.UPDATED(downloadId), callback);
    },
    removeUpdated: (downloadId: string) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !downloadId) return;
        ipcRenderer.removeAllListeners(IPCChannel.Downloads.UPDATED(downloadId));
    }
} as const;

const api: IFlastAPI = {
    togglePictureInPicture: (index: number = 0) => togglePictureInPicture(index),

    getUser: () => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:`) return Promise.reject();
        return ipcRenderer.invoke('get-user');
    },
    getLanguage: (userId: string) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId) return Promise.reject();
        return ipcRenderer.invoke('user-language', userId);
    },
    getUserConfig: (userId: string) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId) return Promise.reject();
        return ipcRenderer.invoke(IPCChannel.User.GET_CONFIG(userId));
    },
    setUserConfig: (userId: string, config: DeepPartial<UserConfig>) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId) return Promise.reject();
        return ipcRenderer.invoke(IPCChannel.User.SET_CONFIG(userId), config);
    },
    setTheme: (userId: string) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId) return Promise.reject();
        return ipcRenderer.invoke('set-theme', userId);
    },

    search: (userId: string, keyword: string) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:` || !userId) return Promise.reject();
        return ipcRenderer.invoke(`search-${userId}`, keyword);
    },

    bookmarks: bookmarksApi,
    history: historyApi,
    downloads: downloadsApi
};

contextBridge.exposeInMainWorld('flast', api);


if (window.location.host === 'chrome.google.com')
    injectChromeWebStoreInstallButton();
