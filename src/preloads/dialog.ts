import { getCurrentWebContents } from '@electron/remote';
import { ipcRenderer } from 'electron';
import { IPCChannel } from '../constants/ipc';

window.addEventListener('blur', () => ipcRenderer.invoke(IPCChannel.Dialog.HIDE(getCurrentWebContents().id)));
