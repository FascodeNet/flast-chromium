import { app } from 'electron';
import { join } from 'path';
import { DIALOG_SEARCH_NAME } from '../../constants/dialog';
import { IS_DEVELOPMENT } from '../../utils/process';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { AppWindow } from '../windows/app';
import { Dialog } from './dialog';

export const showSearchDialog = (user: IUser, window: AppWindow, x: number, y: number, width: number): Dialog => {
    const dialogManager = Main.dialogManager;

    const { height } = window.browserWindow.getContentBounds();
    const bounds = {
        width,
        height,
        x,
        y
    };

    const dynamicDialog = dialogManager.getDynamic(DIALOG_SEARCH_NAME);
    if (dynamicDialog) {
        dynamicDialog.browserWindow = window.browserWindow;
        dynamicDialog.bounds = bounds;
        dialogManager.show(dynamicDialog);
        return dynamicDialog;
    } else {
        const dialog = dialogManager.show(
            new Dialog(
                user,
                window.browserWindow,
                {
                    name: DIALOG_SEARCH_NAME,
                    bounds,
                    onWindowBoundsUpdate: () => {
                        dialogManager.destroy(dialog);
                        window.webContents.send(`window-hide_search-${window.id}`);
                    },
                    onHide: () => {
                        dialogManager.destroy(dialog);
                        window.webContents.send(`window-hide_search-${window.id}`);
                    }
                }
            )
        );

        dialog.webContents.loadFile(join(app.getAppPath(), 'build', 'browser', 'search.html'));
        dialog.webContents.focus();

        dialog.webContents.once('dom-ready', () => {
            if (!IS_DEVELOPMENT) return;

            // 開発モードの場合はデベロッパーツールを開く
            // dialog.browserView.webContents.openDevTools({ mode: 'detach' });
        });

        return dialog;
    }
};
