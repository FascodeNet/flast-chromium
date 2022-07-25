import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { DIALOG_HISTORIES_NAME } from '../../constants/dialog';
import { IS_DEVELOPMENT } from '../../utils/process';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { Dialog } from './dialog';

export const showHistoriesDialog = (user: IUser, browserWindow: BrowserWindow, x: number, y: number): Dialog => {
    const dialogManager = Main.dialogManager;

    const bounds = {
        width: 350,
        height: 660,
        x: x - 300,
        y
    };

    const dynamicDialog = dialogManager.getDynamic(DIALOG_HISTORIES_NAME);
    if (dynamicDialog) {
        dynamicDialog.browserWindow = browserWindow;
        dynamicDialog.bounds = bounds;
        dialogManager.show(dynamicDialog);
        return dynamicDialog;
    } else {
        const dialog = dialogManager.show(
            new Dialog(
                user,
                browserWindow,
                {
                    name: DIALOG_HISTORIES_NAME,
                    bounds,
                    onWindowBoundsUpdate: () => dialogManager.destroy(dialog),
                    onHide: () => dialogManager.destroy(dialog)
                }
            )
        );

        dialog.webContents.loadFile(join(app.getAppPath(), 'build', 'browser', 'histories.html'));
        dialog.webContents.focus();

        dialog.webContents.once('dom-ready', () => {
            if (!IS_DEVELOPMENT) return;

            // 開発モードの場合はデベロッパーツールを開く
            // dialog.browserView.webContents.openDevTools({ mode: 'detach' });
        });

        return dialog;
    }
};
