import { app, Session } from 'electron';
import { APPLICATION_NAME, APPLICATION_PROTOCOL } from '../../utils';
import { getBuildPath } from '../../utils/path';
import { IUser } from '../interfaces/user';

export const setUserAgent = (session: Session) => session.setUserAgent(
    session.getUserAgent()
        .replace(/\sElectron\/\S+/, '')
        .replace(app.getName(), APPLICATION_NAME)
);

export const setWebRequest = (session: Session, user: IUser) => {
    session.webRequest.onBeforeSendHeaders((details, callback) => {
        if (!user.settings.config.privacy_security.send_dnt_request)
            return callback(details);

        details.requestHeaders.DNT = '1';
        return callback({ ...details, requestHeaders: details.requestHeaders });
    });
};

export const registerProtocols = (session: Session) => {
    session.protocol.registerFileProtocol(
        APPLICATION_PROTOCOL,
        (request, callback) => {
            const { hostname, pathname } = new URL(request.url);

            if (pathname === '/' || !pathname.match(/(.*)\.([A-z0-9])\w+/g)) {
                callback({
                    path: getBuildPath('pages', `${hostname}.html`)
                });
            } else {
                callback({
                    path: getBuildPath('pages', pathname.substring(1))
                });
            }
        }
    );
};
