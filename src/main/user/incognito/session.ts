import { app, Session as ElectronSession, session } from 'electron';
import { ElectronChromeExtensions } from 'electron-chrome-extensions';
import { join } from 'path';
import { parse } from 'url';
import { APPLICATION_PROTOCOL } from '../../../utils';
import { ISession, IUser } from '../../interfaces/user';

export class IncognitoSession implements ISession {

    readonly user: IUser;

    private readonly _session: ElectronSession;

    public constructor(user: IUser) {
        this.user = user;

        this._session = session.fromPartition(user.id);

        const userAgent = this._session.getUserAgent().replace(/\sElectron\/\S+/, '').replace(/\sChrome\/\S+/g, '').replace(new RegExp(`\\s${app.getName()}/\\S+`), '');
        this._session.setUserAgent(userAgent);

        this._session.protocol.registerFileProtocol(
            APPLICATION_PROTOCOL,
            (request, callback: any) => {
                const parsed = parse(request.url);

                if (parsed.path === '/') {
                    return callback({
                        path: join(__dirname, `${parsed.hostname}.html`)
                    });
                }

                callback({ path: join(__dirname, parsed.path!!) });
            }
        );
    }

    public get session() {
        return this._session;
    }

    public get extensions(): ElectronChromeExtensions {
        throw new Error('This user is not allowed to use extensions!');
    }
}
