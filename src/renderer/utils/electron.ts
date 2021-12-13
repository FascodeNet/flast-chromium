import { getCurrentWebContents, getCurrentWindow } from '@electron/remote';
import { ipcRenderer } from 'electron';
import { UserConfig } from '../../interfaces/user';
import { MoveDirection, ViewState } from '../../interfaces/view';

interface ElectronAPI {
    getWindowId: () => number;
    showApplicationMenu: () => Promise<void>;

    isMinimized: () => Promise<boolean>;
    isMaximized: () => Promise<boolean>;
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
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

    getCurrentUserId: () => Promise<string>;
    getUserConfig: (id: string) => Promise<UserConfig>;
    setUserConfig: (id: string, config: UserConfig | any) => Promise<void>;
}

const windowId = getCurrentWindow().id;
export const useElectronAPI = (): ElectronAPI => ({
    getWindowId: () => getCurrentWindow().id,
    showApplicationMenu: () => ipcRenderer.invoke(`window-menu-${windowId}`),

    isMinimized: () => ipcRenderer.invoke(`window-minimized-${windowId}`),
    isMaximized: () => ipcRenderer.invoke(`window-maximized-${windowId}`),
    minimize: () => ipcRenderer.invoke(`window-minimize-${windowId}`),
    maximize: () => ipcRenderer.invoke(`window-maximize-${windowId}`),
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

    getCurrentUserId: () => ipcRenderer.invoke(`window-user-${windowId}`),
    getUserConfig: (id: string) => ipcRenderer.invoke(`get-user-config`, id),
    setUserConfig: (id: string, config: UserConfig | any) => ipcRenderer.invoke(`set-user-config`, id, config)
});
