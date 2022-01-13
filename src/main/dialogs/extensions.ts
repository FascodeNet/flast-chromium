import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { IS_DEVELOPMENT } from '../../utils/process';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { Dialog } from './dialog';

const DIALOG_NAME = 'extensions';

export const showExtensionsDialog = (user: IUser, browserWindow: BrowserWindow, x: number, y: number) => {
    const dialogManager = Main.dialogManager;

    const bounds = {
        width: 350,
        height: 650,
        x: x - 300,
        y: y
    };

    const dynamicDialog = dialogManager.getDynamic(DIALOG_NAME);
    if (dynamicDialog) {
        dynamicDialog.browserWindow = browserWindow;
        dynamicDialog.bounds = bounds;
        dialogManager.show(dynamicDialog);
    } else {
        const dialog = dialogManager.show(
            new Dialog(
                user,
                browserWindow,
                {
                    name: DIALOG_NAME,
                    bounds,
                    onWindowBoundsUpdate: () => dialogManager.destroy(dialog),
                    onHide: () => dialogManager.destroy(dialog)
                }
            )
        );

        dialog.webContents.loadFile(join(app.getAppPath(), 'build', 'internal-extensions.html'));
        dialog.webContents.focus();

        dialog.webContents.once('dom-ready', () => {
            if (!IS_DEVELOPMENT) return;

            // 開発モードの場合はデベロッパーツールを開く
            // dialog.browserView.webContents.openDevTools({ mode: 'detach' });
        });
    }
};
