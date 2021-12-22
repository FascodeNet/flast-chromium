import { getCurrentWebContents } from '@electron/remote';
import { ipcRenderer } from 'electron';

window.addEventListener('blur', () => {
    ipcRenderer.invoke(`dialog-hide-${getCurrentWebContents().id}`);
});
