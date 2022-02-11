import { contextBridge, ipcRenderer } from 'electron';
import { UserConfig } from '../interfaces/user';
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

contextBridge.exposeInMainWorld(
    'api',
    {
        togglePictureInPicture: (index: number = 0) => togglePictureInPicture(index),
        getUser: () => ipcRenderer.invoke('get-user'),
        getLanguage: (id: string) => ipcRenderer.invoke('user-language', id),
        getUserConfig: (id: string) => ipcRenderer.invoke('get-user-config', id),
        setUserConfig: (id: string, config: DeepPartial<UserConfig>) => ipcRenderer.invoke('set-user-config', id, config),
        setTheme: (id: string) => ipcRenderer.invoke('set-theme', id)
    }
);


if (window.location.host === 'chrome.google.com')
    injectChromeWebStoreInstallButton();
