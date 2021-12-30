import { Dialog } from '../dialogs/dialog';

export class DialogManager {

    public constructor() {

    }

    private _dialogs: Dialog[] = [];

    public get dialogs() {
        return this._dialogs;
    }

    public show(dialog: Dialog) {
        if (!this.getDynamic(dialog.name))
            this._dialogs.push(dialog);
        dialog.show();
        return dialog;
    }

    public hide(dialog: Dialog) {
        dialog.hide();
        return dialog;
    }

    public destroy(dialog: Dialog) {
        dialog.destroy();
        this._dialogs = this._dialogs.filter((dlg) => dlg.name !== dialog.name);
    }

    public getDynamic(name: string) {
        return this._dialogs.find((dialog) => dialog.name === name);
    }
}
