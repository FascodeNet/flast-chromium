import { app, Session } from 'electron';
import { APPLICATION_NAME, APPLICATION_PROTOCOL } from '../../constants';
import { getBuildPath } from '../../utils/path';
import { IUser } from '../interfaces/user';

export const setUserAgent = (session: Session) => session.setUserAgent(
    session.getUserAgent()
        .replace(/\sElectron\/\S+/, '')
        .replace(app.getName(), APPLICATION_NAME)
);

export const setWebRequest = (session: Session, user: IUser) => {
    session.webRequest.onBeforeSendHeaders((details, callback) => {
        if (user.settings.config.privacy_security.send_dnt_request)
            details.requestHeaders.DNT = '1';

        return callback({ requestHeaders: details.requestHeaders });
    });
};

export const registerProtocols = (session: Session) => {
    session.protocol.registerFileProtocol(
        APPLICATION_PROTOCOL,
        (request, callback) => {
            const { hostname, pathname } = new URL(request.url);

            console.log(pathname);
            if (pathname === '/' || !pathname.match(/(.*)\.([A-z0-9])\w+/g)) {
                console.log(getBuildPath('pages', `${hostname}.html`));
                callback({
                    path: getBuildPath('pages', `${hostname}.html`)
                });
            } else {
                console.log(getBuildPath('pages', pathname.substring(1)));
                callback({
                    path: getBuildPath('pages', pathname.substring(1))
                });
            }
        }
    );
};
