import { contextBridge, ipcRenderer } from 'electron';
import { IFlastAPI } from '../@types/electron';
import { BookmarkData, OmitData, UserConfig } from '../interfaces/user';
import { APPLICATION_PROTOCOL, DeepPartial } from '../utils';
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

const api: IFlastAPI = {
    togglePictureInPicture: (index: number = 0) => togglePictureInPicture(index),

    getUser: () => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:`) return Promise.reject();
        return ipcRenderer.invoke('get-user');
    },
    getLanguage: (userId: string) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:`) return Promise.reject();
        return ipcRenderer.invoke('user-language', userId);
    },
    getUserConfig: (userId: string) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:`) return Promise.reject();
        return ipcRenderer.invoke('get-user-config', userId);
    },
    setUserConfig: (userId: string, config: DeepPartial<UserConfig>) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:`) return Promise.reject();
        return ipcRenderer.invoke('set-user-config', userId, config);
    },
    setTheme: (userId: string) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:`) return Promise.reject();
        return ipcRenderer.invoke('set-theme', userId);
    },

    search: (userId: string, keyword: string) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:`) return Promise.reject();
        return ipcRenderer.invoke(`search-${userId}`, keyword);
    },

    getBookmarks: (userId: string): Promise<BookmarkData[]> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:`) return Promise.reject();
        if (!userId) return Promise.resolve([]);
        return ipcRenderer.invoke(`bookmarks-${userId}`);
    },
    addBookmark: (userId: string, data: OmitData<BookmarkData>): Promise<BookmarkData> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:`) return Promise.reject();
        if (!userId || !data) return Promise.reject();
        return ipcRenderer.invoke(`bookmark-add-${userId}`, data);
    },
    removeBookmark: (userId: string, bookmarkId: string): Promise<boolean> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:`) return Promise.reject();
        if (!userId || !bookmarkId) return Promise.resolve(false);
        return ipcRenderer.invoke(`bookmark-remove-${userId}`, bookmarkId);
    },
    updateBookmark: (userId: string, bookmarkId: string, data: OmitData<BookmarkData>): Promise<BookmarkData> => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:`) return Promise.reject();
        if (!userId || !bookmarkId || !data) return Promise.reject();
        return ipcRenderer.invoke(`bookmark-update-${userId}`, bookmarkId, data);
    },

    getHistory: (userId: string) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:`) return Promise.reject();
        if (!userId) return Promise.resolve();
        return ipcRenderer.invoke(`history-${userId}`);
    },
    getHistoryGroups: (userId: string) => {
        if (window.location.protocol !== `${APPLICATION_PROTOCOL}:`) return Promise.reject();
        if (!userId) return Promise.resolve();
        return ipcRenderer.invoke(`history-groups-${userId}`);
    }
};

contextBridge.exposeInMainWorld('flast', api);


if (window.location.host === 'chrome.google.com')
    injectChromeWebStoreInstallButton();
