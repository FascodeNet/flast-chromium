import { Session as ElectronSession, session } from 'electron';
import { ElectronChromeExtensions } from 'electron-chrome-extensions';
import { ISession, IUser } from '../../interfaces/user';
import { registerProtocols, setUserAgent, setWebRequest } from '../../utils/session';

export class IncognitoSession implements ISession {

    public readonly user: IUser;

    private readonly _session: ElectronSession;

    public constructor(user: IUser) {
        this.user = user;

        this._session = session.fromPartition(user.id);

        setUserAgent(this._session);
        setWebRequest(this._session, this.user);
        registerProtocols(this._session);
    }

    public get session() {
        return this._session;
    }

    public get extensions(): ElectronChromeExtensions {
        throw new Error('This user is not allowed to use extensions!');
    }
}
