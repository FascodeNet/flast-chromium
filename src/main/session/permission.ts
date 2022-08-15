import { dialog, Session } from 'electron';
import { SitePermissionData } from '../../interfaces/user';
import { nonNullable } from '../../utils/array';
import { IUser } from '../interfaces/user';

export const PermissionTypes = ['geolocation', 'camera', 'microphone', 'notifications', 'sensors', 'midi', 'hid', 'serial', 'idle_detection', 'clipboard', 'pointer_lock', 'open_external'] as const;
export type PermissionType = typeof PermissionTypes[number];

const registerPermissionRequestListener = (session: Session, user: IUser) => {
    const sites = user.sites;
    session.setPermissionRequestHandler(async (
        webContents,
        permission,
        callback,
        { requestingUrl, mediaTypes, externalURL }
    ) => {
        const { origin } = new URL(requestingUrl);

        console.log('権限の確認:', permission, requestingUrl, mediaTypes, externalURL);

        switch (permission as string) {
            case 'unknown':
                return callback(false);
            case 'display-capture':
            case 'persistent-storage':
            case 'fullscreen':
                return callback(true);
            case 'mediaKeySystem':
                const contentData = sites.contents.find((site) => site.origin === origin && site.type === 'protected_content');

                if (contentData) {
                    return callback(contentData.callback);
                } else {
                    return callback(user.settings.config.sites.contents.protected_content === 'allow');
                }
            default:
                const types = getPermissionTypes(permission, mediaTypes);
                if (!types || types.length < 1)
                    return callback(false);

                if (types.length > 1) {
                    const permissions = types.map((type) => user.sites.getPermission(origin, type)).filter(nonNullable);

                    if (types.length === permissions.length && permissions.every((data) => data.callback)) {
                        return callback(true);
                    } else if (permissions.some((data) => !data.callback)) {
                        return callback(false);
                    } else {
                        if (types.some((type) => user.settings.config.sites.permissions[type] === 'deny'))
                            return callback(false);

                        const { response } = await dialog.showMessageBox({
                            type: 'question',
                            message: `${types} を ${origin} に許可してもよろしいですか？`,
                            buttons: ['いいえ', 'はい'],
                            defaultId: 0,
                            noLink: true
                        });

                        for (const type of types) {
                            await sites.add<SitePermissionData>({
                                kind: 'permission',
                                origin,
                                type,
                                callback: response === 1
                            });
                        }

                        return callback(response === 1);
                    }
                } else {
                    const type = types[0];
                    const permissionData = user.sites.getPermission(origin, type);
                    if (permissionData) {
                        return callback(permissionData.callback);
                    } else {
                        if (user.settings.config.sites.permissions[type] === 'deny')
                            return callback(false);

                        const { response } = await dialog.showMessageBox({
                            type: 'question',
                            message: `${type} を ${origin} に許可してもよろしいですか？`,
                            buttons: ['いいえ', 'はい'],
                            defaultId: 0,
                            noLink: true
                        });

                        await sites.add<SitePermissionData>({
                            kind: 'permission',
                            origin,
                            type,
                            callback: response === 1
                        });

                        return callback(response === 1);
                    }
                }
        }
    });
};

const registerPermissionCheckListener = (session: Session, user: IUser) => {
    session.setPermissionCheckHandler((
        webContents,
        permission,
        requestingOrigin,
        { requestingUrl, mediaType }
    ) => {
        const { origin } = new URL(requestingUrl ?? requestingOrigin);

        console.log('権限のチェック:', permission, requestingOrigin, requestingUrl, mediaType);

        const types = getPermissionTypes(permission, mediaType && mediaType !== 'unknown' ? [mediaType] : undefined);
        if (!types || types.length < 1)
            return false;

        if (types.length > 1) {
            const permissions = types.map((type) => user.sites.getPermission(origin, type)).filter(nonNullable);

            if (types.length === permissions.length && permissions.every((data) => data.callback)) {
                return true;
            } else if (permissions.some((data) => !data.callback)) {
                return false;
            } else {
                return types.every((type) => user.settings.config.sites.permissions[type] !== 'deny');
            }
        } else {
            const type = types[0];
            const permissionData = user.sites.getPermission(origin, type);
            if (permissionData) {
                return permissionData.callback;
            } else {
                return user.settings.config.sites.permissions[type] !== 'deny';
            }
        }
    });
};

export const registerPermissionListener = (session: Session, user: IUser) => {
    registerPermissionRequestListener(session, user);
    registerPermissionCheckListener(session, user);
};

export const getPermissionTypes = (permission: string, mediaTypes?: ('video' | 'audio')[]): PermissionType[] | undefined => {
    switch (permission) {
        case 'media':
            const types: ('camera' | 'microphone')[] = [];
            if (mediaTypes?.includes('video'))
                types.push('camera');
            if (mediaTypes?.includes('audio'))
                types.push('microphone');
            return types;
        case 'midi':
        case 'midiSysex':
            return ['midi'];
        case 'idle-detection':
            return ['idle_detection'];
        case 'clipboard-read':
        case 'clipboard-sanitized-write':
            return ['clipboard'];
        case 'pointerLock':
            return ['pointer_lock'];
        case 'openExternal':
            return ['open_external'];
        default:
            return [permission as PermissionType] ?? undefined;
    }
};
