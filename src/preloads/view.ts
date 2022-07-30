import { contextBridge, ipcRenderer } from 'electron';
import { IElectronAPI } from '../@types/electron';
import { BookmarkData, OmitData, UserConfig } from '../interfaces/user';
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

const api: IElectronAPI = {
    togglePictureInPicture: (index: number = 0) => togglePictureInPicture(index),

    getUser: () => ipcRenderer.invoke('get-user'),
    getLanguage: (userId: string) => ipcRenderer.invoke('user-language', userId),
    getUserConfig: (userId: string) => ipcRenderer.invoke('get-user-config', userId),
    setUserConfig: (userId: string, config: DeepPartial<UserConfig>) => ipcRenderer.invoke('set-user-config', userId, config),
    setTheme: (userId: string) => ipcRenderer.invoke('set-theme', userId),

    getBookmarks: (userId: string) => ipcRenderer.invoke(`bookmarks-${userId}`),
    addBookmark: (userId: string, data: OmitData<BookmarkData>) => ipcRenderer.invoke(`bookmark-add-${userId}`, data),
    removeBookmark: (userId: string, bookmarkId: string) => ipcRenderer.invoke(`bookmark-remove-${userId}`, bookmarkId),
    updateBookmark: (userId: string, bookmarkId: string, data: OmitData<BookmarkData>) => ipcRenderer.invoke(`bookmark-update-${userId}`, bookmarkId, data),

    getHistory: (userId: string) => ipcRenderer.invoke(`history-${userId}`),
    getHistoryGroups: (userId: string) => ipcRenderer.invoke(`history-groups-${userId}`)
};

contextBridge.exposeInMainWorld('api', api);


if (window.location.host === 'chrome.google.com')
    injectChromeWebStoreInstallButton();
