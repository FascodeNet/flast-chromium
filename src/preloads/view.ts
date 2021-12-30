import { contextBridge, ipcRenderer } from 'electron';
import { UserConfig } from '../interfaces/user';
import { DeepPartial } from '../utils';

export const togglePictureInPicture = async (index: number = 0) => {
    if (!document.pictureInPictureElement) {
        const elements = document.querySelectorAll('video');
        if (elements.length > 0 && elements.length > index && elements[index]) {
            await elements[index].requestPictureInPicture();
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
