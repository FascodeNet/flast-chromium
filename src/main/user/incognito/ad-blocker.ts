import { ElectronBlocker } from '@cliqz/adblocker-electron';
import fetch from 'node-fetch';
import { IAdBlocker, IUser } from '../../interfaces/user';

export class IncognitoAdBlocker implements IAdBlocker {

    public readonly user: IUser;

    private _blocker?: ElectronBlocker;

    public constructor(user: IUser) {
        this.user = user;

        ElectronBlocker.fromLists(
            fetch,
            this.user.settings.config.ad_blocker.filters.filter((filter) => filter.enabled).map((filter) => filter.url)
        ).then((blocker) => {
            this._blocker = blocker;
        }).catch(() => {

        });
    }

    public get blocker() {
        return this._blocker;
    }

    public enable(): boolean {
        const session = this.user.session.session;
        if (!this._blocker || this._blocker.isBlockingEnabled(session))
            return false;

        this._blocker.enableBlockingInSession(session);
        return true;
    }

    public disable(): boolean {
        const session = this.user.session.session;
        if (!this._blocker || !this._blocker.isBlockingEnabled(session))
            return false;

        this._blocker.disableBlockingInSession(session);
        return true;
    }

    public async reload() {
        const blocker = await ElectronBlocker.fromLists(
            fetch,
            this.user.settings.config.ad_blocker.filters.filter((filter) => filter.enabled).map((filter) => filter.url)
        );

        this._blocker = blocker;

        return blocker;
    }
}
