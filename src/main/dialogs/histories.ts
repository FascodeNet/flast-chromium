import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { Main } from '../main';
import { Dialog } from './dialog';

export const showHistoriesDialog = (browserWindow: BrowserWindow, x: number, y: number) => {
    const dialogManager = Main.dialogManager;

    const bounds = {
        width: 330,
        height: 630,
        x: x - 285,
        y: y
    };

    const dynamicDialog = dialogManager.getDynamic('histories');
    if (dynamicDialog) {
        dynamicDialog.browserWindow = browserWindow;
        dynamicDialog.bounds = bounds;
        dialogManager.show(dynamicDialog);
    } else {
        const dialog = dialogManager.show(
            new Dialog(
                browserWindow,
                {
                    name: 'histories',
                    bounds,
                    onWindowBoundsUpdate: () => dialog.hide()
                }
            )
        );

        dialog.browserView.webContents.loadFile(join(app.getAppPath(), 'build', 'internal-histories.html'));
        dialog.browserView.webContents.openDevTools();
    }
};
