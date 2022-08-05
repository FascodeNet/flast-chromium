import { DIALOG_FIND_NAME } from '../../constants/dialog';
import { getHeight } from '../../utils/design';
import { getBuildPath } from '../../utils/path';
import { IS_DEVELOPMENT } from '../../utils/process';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { AppView } from '../views/app';
import { Dialog } from './dialog';

export const showFindDialog = (user: IUser, view: AppView): Dialog => {
    const dialogManager = Main.dialogManager;

    const { width } = view.window.browserWindow.getContentBounds();
    const bounds = {
        width: 380,
        height: 70,
        x: width - 400,
        y: getHeight(user.settings.config.appearance.style)
    };

    const dialogName = `${DIALOG_FIND_NAME}-${view.id}`;
    const dynamicDialog = dialogManager.getDynamic(dialogName);
    if (dynamicDialog) {
        dynamicDialog.browserWindow = view.window.browserWindow;
        dynamicDialog.bounds = bounds;
        dialogManager.show(dynamicDialog);
        return dynamicDialog;
    } else {
        const dialog = dialogManager.show(
            new Dialog(
                user,
                view.window.browserWindow,
                {
                    name: dialogName,
                    bounds
                    // onWindowBoundsUpdate: () => dialogManager.destroy(dialog),
                    // onHide: () => dialogManager.destroy(dialog)
                }
            )
        );

        dialog.webContents.loadFile(getBuildPath('browser', 'find.html'));
        dialog.webContents.focus();

        dialog.webContents.once('dom-ready', () => {
            if (!IS_DEVELOPMENT) return;

            // 開発モードの場合はデベロッパーツールを開く
            // dialog.browserView.webContents.openDevTools({ mode: 'detach' });
        });

        return dialog;
    }
};
