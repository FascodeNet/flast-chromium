import { app, DownloadItem, Session as ElectronSession, session } from 'electron';
import { ElectronChromeExtensions } from 'electron-chrome-extensions-production';
import { join } from 'path';
import { ISession, IUser } from '../../interfaces/user';
import { Main } from '../../main';
import { registerProtocols, setUserAgent, setWebRequest } from '../../session';
import { IncognitoUser } from '../incognito';
import { NormalUser } from './index';

export class NormalSession implements ISession {

    public readonly user: IUser;

    private readonly _session: ElectronSession;
    private readonly _extensions: ElectronChromeExtensions;

    public downloadItems = new Map<string, DownloadItem>();

    public constructor(user: IUser) {
        this.user = user;

        this._session = session.fromPartition(`persist:user_${user.id}`);
        this._extensions = new ElectronChromeExtensions({
            modulePath: join(app.getAppPath(), 'node_modules', 'electron-chrome-extensions-production'),
            session: this._session,
            createTab: ({ windowId, url, active }) => {
                const window = Main.windowManager.get(windowId!!);
                if (!window || window.browserWindow.isDestroyed())
                    throw new Error(`Unable to find windowId = ${windowId}.`);

                const view = window.tabManager.add(url, active);

                return Promise.resolve([view.webContents, view.window.browserWindow]);
            },
            removeTab: (webContents, browserWindow) => {
                if (browserWindow.isDestroyed())
                    return;

                const window = Main.windowManager.get(browserWindow.id);
                if (!window)
                    return;

                window.tabManager.remove(webContents.id);
            },
            selectTab: (webContents, browserWindow) => {
                if (browserWindow.isDestroyed())
                    return;

                const window = Main.windowManager.windows.find((appWindow) => appWindow.tabManager.get(webContents.id) !== undefined);
                if (!window)
                    return;

                window.tabManager.select(webContents.id);
            },

            createWindow: ({ url, incognito }) => {
                const createWindow = () => {
                    const window = Main.windowManager.add(
                        user,
                        typeof url === 'string' ? [url] : url,
                        true
                    );

                    return Promise.resolve(window.browserWindow);
                };

                if (incognito) {
                    if (user instanceof NormalUser) {
                        const incognitoUser = Main.userManager.add(new IncognitoUser(user));
                        Main.windowManager.add(incognitoUser, undefined);

                        const window = Main.windowManager.add(
                            incognitoUser,
                            typeof url === 'string' ? [url] : url,
                            true
                        );

                        return Promise.resolve(window.browserWindow);
                    } else if (user instanceof IncognitoUser) {
                        const incognitoUser = Main.userManager.add(new IncognitoUser(user.fromUser));
                        Main.windowManager.add(incognitoUser, undefined);

                        const window = Main.windowManager.add(
                            user,
                            typeof url === 'string' ? [url] : url,
                            true
                        );

                        return Promise.resolve(window.browserWindow);
                    } else {
                        return createWindow();
                    }
                } else {
                    return createWindow();
                }
            },
            removeWindow: (browserWindow: Electron.BrowserWindow) => {
                if (browserWindow.isDestroyed())
                    return;

                Main.windowManager.remove(browserWindow.id);
            }
        });

        setUserAgent(this._session);
        setWebRequest(this._session, this.user);
        registerProtocols(this._session, this.user);
    }

    public get session() {
        return this._session;
    }

    public get extensions() {
        return this._extensions;
    }
}
