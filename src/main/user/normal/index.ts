import { ipcMain } from 'electron';
import { mkdir } from 'fs/promises';
import { IPCChannel } from '../../../constants/ipc';
import { UserConfig, UserType } from '../../../interfaces/user';
import { DeepPartial } from '../../../utils';
import { getUserDataPath } from '../../../utils/path';
import { IUser } from '../../interfaces/user';
import { App, Main } from '../../main';
import { registerDownloadListener } from '../../session/download';
import { registerPermissionListener } from '../../session/permission';
import { search } from '../../utils/search';
import { NormalAdBlocker } from './ad-blocker';
import { NormalBookmarks } from './bookmarks';
import { NormalDownloads } from './downloads';
import { NormalExtensions } from './extensions';
import { NormalHistory } from './history';
import { NormalSession } from './session';
import { NormalSettings } from './settings';
import { NormalSites } from './sites';

export class NormalUser implements IUser {

    public readonly id: string;

    public readonly type: UserType = 'normal';

    private readonly path: string;

    private readonly _session: NormalSession;

    private readonly _bookmarks: NormalBookmarks;
    private readonly _history: NormalHistory;
    private readonly _downloads: NormalDownloads;

    private readonly _extensions: NormalExtensions;
    private readonly _settings: NormalSettings;

    private readonly _adBlocker: NormalAdBlocker;
    private readonly _sites: NormalSites;

    public constructor(id: string) {
        this.id = id;

        this.path = getUserDataPath(id);
        mkdir(this.path, { recursive: true });

        this._session = new NormalSession(this);

        this._bookmarks = new NormalBookmarks(this);
        this._history = new NormalHistory(this);
        this._downloads = new NormalDownloads(this);

        this._extensions = new NormalExtensions(this);
        this._settings = new NormalSettings(this);

        this._adBlocker = new NormalAdBlocker(this);
        this._sites = new NormalSites(this);

        registerPermissionListener(this._session.session, this);
        registerDownloadListener(this._session.session, this);

        if (this._settings.config.ad_blocker.enabled)
            this._adBlocker.enable();

        ipcMain.handle(IPCChannel.User.TYPE(this.id), (e) => {
            return this.type;
        });

        ipcMain.handle(IPCChannel.User.GET_CONFIG(this.id), (e) => {
            return this._settings.config;
        });
        ipcMain.handle(IPCChannel.User.SET_CONFIG(this.id), (e, config: DeepPartial<UserConfig>) => {
            this._settings.config = config;

            if (this._settings.config.ad_blocker.enabled) {
                this._adBlocker.reload().then((blocker) => {
                    blocker.enableBlockingInSession(this._session.session);
                });
            } else {
                this._adBlocker.disable();
            }

            App.setTheme(this._settings.config);

            const windows = Main.windowManager.getWindows(this);
            windows.forEach(async (window) => {
                window.viewManager.views.forEach((view) => view.setBounds());
                window.webContents.send(IPCChannel.User.UPDATED_SETTINGS(this.id), this._settings.config);
                await window.setStyle();
            });

            return this._settings.config;
        });

        ipcMain.handle(`search-${this.id}`, async (e, keyword: string) => {
            return await search(keyword, this);
        });
    }

    public get name() {
        return this._settings.config.profile.name;
    }

    public get avatar() {
        return this._settings.config.profile.avatar;
    }

    public get session() {
        return this._session;
    }

    public get bookmarks() {
        return this._bookmarks;
    }

    public get history() {
        return this._history;
    }

    public get downloads() {
        return this._downloads;
    }

    public get extensions() {
        return this._extensions;
    }

    public get settings() {
        return this._settings;
    }

    public get adBlocker() {
        return this._adBlocker;
    }

    public get sites() {
        return this._sites;
    }
}
