import { app, Session } from 'electron';
import { APPLICATION_NAME, APPLICATION_PROTOCOL, APPLICATION_RESOURCE_AVATAR } from '../../constants';
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

export const registerProtocols = (session: Session, user: IUser) => {
    session.protocol.registerFileProtocol(
        APPLICATION_PROTOCOL,
        (request, callback) => {
            const { hostname, pathname } = new URL(request.url);

            if (hostname === APPLICATION_RESOURCE_AVATAR) {
                callback({
                    path: user.settings.config.profile.avatar ?? undefined
                });
            } else {
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
        }
    );
};
