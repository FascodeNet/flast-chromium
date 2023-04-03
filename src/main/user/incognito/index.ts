import { ipcMain } from 'electron';
import { nanoid } from 'nanoid';
import { IPCChannel } from '../../../constants/ipc';
import { UserConfig, UserType } from '../../../interfaces/user';
import { DeepPartial } from '../../../utils';
import { IUser } from '../../interfaces/user';
import { App, Main } from '../../main';
import { ViewManager } from '../../manager/view';
import { registerDownloadListener } from '../../session/download';
import { registerPermissionListener } from '../../session/permission';
import { search } from '../../utils/search';
import { NormalUser } from '../normal';
import { IncognitoAdBlocker } from './ad-blocker';
import { IncognitoBookmarks } from './bookmarks';
import { IncognitoDownloads } from './downloads';
import { IncognitoExtensions } from './extensions';
import { IncognitoHistory } from './history';
import { IncognitoSession } from './session';
import { IncognitoSettings } from './settings';
import { IncognitoSites } from './sites';

export class IncognitoUser implements IUser {

    public readonly id: string;

    public readonly fromUser: NormalUser;

    public readonly type: UserType = 'incognito';

    private readonly _session: IncognitoSession;

    private readonly _bookmarks: IncognitoBookmarks;
    private readonly _history: IncognitoHistory;
    private readonly _downloads: IncognitoDownloads;

    private readonly _extensions: IncognitoExtensions;
    private readonly _settings: IncognitoSettings;

    private readonly _adBlocker: IncognitoAdBlocker;
    private readonly _sites: IncognitoSites;

    private readonly _viewManager: ViewManager;

    public constructor(fromUser: NormalUser) {
        this.id = `incognito_${nanoid()}`;

        this.fromUser = fromUser;

        this._session = new IncognitoSession(this);

        this._bookmarks = new IncognitoBookmarks(this, fromUser);
        this._history = new IncognitoHistory(this, fromUser);
        this._downloads = new IncognitoDownloads(this, fromUser);

        this._extensions = new IncognitoExtensions(this);
        this._settings = new IncognitoSettings(this, fromUser);

        this._adBlocker = new IncognitoAdBlocker(this);
        this._sites = new IncognitoSites(this);

        this._viewManager = new ViewManager(this);

        registerPermissionListener(this._session.session, this);
        registerDownloadListener(this._session.session, this);

        ipcMain.handle(IPCChannel.User.TYPE(this.id), (e) => {
            return this.type;
        });

        ipcMain.handle(IPCChannel.User.GET_CONFIG(this.id), (e) => {
            return this._settings.config;
        });
        ipcMain.handle(IPCChannel.User.SET_CONFIG(this.id), (e, config: DeepPartial<UserConfig>) => {
            this._settings.config = config;
            App.setTheme(this._settings.config);

            const windows = Main.windowManager.getWindows(this);
            windows.forEach(async (window) => {
                window.setViewBounds();
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
        return 'Incognito';
    }

    public get avatar() {
        return null;
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

    public get viewManager() {
        return this._viewManager;
    }
}
