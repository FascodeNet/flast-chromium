import { ElectronBlocker } from '@cliqz/adblocker-electron';
import { readFile, rm, writeFile } from 'fs/promises';
import fetch from 'node-fetch';
import { getUserDataPath } from '../../../utils/path';
import { IAdBlocker, IUser } from '../../interfaces/user';

export class NormalAdBlocker implements IAdBlocker {

    public readonly user: IUser;

    public readonly path: string;

    private _blocker?: ElectronBlocker;

    public constructor(user: IUser) {
        this.user = user;

        this.path = getUserDataPath(this.user.id, 'Filters.bin');

        ElectronBlocker.fromLists(
            fetch,
            this.user.settings.config.ad_blocker.filters.filter((filter) => filter.enabled).map((filter) => filter.url),
            {},
            {
                path: this.path,
                read: readFile,
                write: writeFile
            }
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
        await rm(this.path);

        const blocker = await ElectronBlocker.fromLists(
            fetch,
            this.user.settings.config.ad_blocker.filters.filter((filter) => filter.enabled).map((filter) => filter.url),
            {},
            {
                path: this.path,
                read: readFile,
                write: writeFile
            }
        );

        this._blocker = blocker;

        return blocker;
    }
}
