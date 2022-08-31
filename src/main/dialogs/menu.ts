import { BrowserWindow } from 'electron';
import { DIALOG_MENU_NAME } from '../../constants/dialog';
import { getBuildPath } from '../../utils/path';
import { IS_DEVELOPMENT } from '../../utils/process';
import { buildTheme } from '../../utils/theme';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { Dialog } from './dialog';

export const showMenuDialog = (user: IUser, browserWindow: BrowserWindow, x: number, y: number): Dialog => {
    const dialogManager = Main.dialogManager;

    const { height } = browserWindow.getContentBounds();
    const bounds = {
        width: 670,
        height,
        x: x - 620,
        y
    };

    const dynamicDialog = dialogManager.getDynamic(DIALOG_MENU_NAME);
    if (dynamicDialog) {
        dynamicDialog.browserWindow = browserWindow;
        dynamicDialog.bounds = bounds;
        dialogManager.show(dynamicDialog);
        return dynamicDialog;
    } else {
        const dialog = new Dialog(
            user,
            browserWindow,
            {
                name: DIALOG_MENU_NAME,
                bounds,
                onWindowBoundsUpdate: (d) => dialogManager.destroy(d),
                onHide: (d) => dialogManager.destroy(d)
            }
        );

        dialog.webContents.once('dom-ready', () => {
            if (!IS_DEVELOPMENT) return;

            // 開発モードの場合はデベロッパーツールを開く
            // dialog.browserView.webContents.openDevTools({ mode: 'detach' });
        });

        dialog.webContents.loadFile(
            getBuildPath('browser', 'menu.html'),
            { hash: buildTheme(user).toString() }
        );
        dialog.setStyle();

        dialogManager.show(dialog);
        dialog.webContents.focus();

        return dialog;
    }
};
