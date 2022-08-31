import { nativeTheme } from '@electron/remote';
import { Avatar } from '@mui/material';
import clsx from 'clsx';
import React, { MouseEvent } from 'react';
import { isSingle } from '../../../../../../utils/design';
import { IconButton } from '../../../../../components/Button';
import { Bookmarks, Download, Extension, History, MenuMore } from '../../../../../components/Icons';
import { useUserConfigContext } from '../../../../../contexts/config';
import { MuiDarkGlobalStyles, MuiLightGlobalStyles } from '../../../../../themes';
import { useElectronAPI } from '../../../../../utils/electron';

export const BookmarksButton = () => {
    const { popupApi } = useElectronAPI();

    const { config: { appearance: { style } } } = useUserConfigContext();

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        popupApi.bookmarks(x, y + height);
    };

    return (
        <IconButton
            onClick={handleButtonClick}
            size={isSingle(style) ? 34 : 32}
            className={clsx('action-button', 'bookmarks')}
        >
            <Bookmarks />
        </IconButton>
    );
};

export const HistoryButton = () => {
    const { popupApi } = useElectronAPI();

    const { config: { appearance: { style } } } = useUserConfigContext();

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        popupApi.history(x, y + height);
    };

    return (
        <IconButton
            onClick={handleButtonClick}
            size={isSingle(style) ? 34 : 32}
            className={clsx('action-button', 'history')}
        >
            <History />
        </IconButton>
    );
};

export const DownloadsButton = () => {
    const { popupApi } = useElectronAPI();

    const { config: { appearance: { style } } } = useUserConfigContext();

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        popupApi.downloads(x, y + height);
    };

    return (
        <IconButton
            onClick={handleButtonClick}
            size={isSingle(style) ? 34 : 32}
            className={clsx('action-button', 'downloads')}
        >
            <Download />
        </IconButton>
    );
};

export const ExtensionsButton = () => {
    const { popupApi } = useElectronAPI();

    const { config: { appearance: { style } } } = useUserConfigContext();

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        popupApi.extensions(x, y + height);
    };

    return (
        <IconButton
            onClick={handleButtonClick}
            size={isSingle(style) ? 34 : 32}
            className={clsx('action-button', 'extensions')}
        >
            <Extension />
        </IconButton>
    );
};

export const ProfileButton = () => {
    const { popupApi } = useElectronAPI();

    const { config: { profile: { name, avatar }, appearance: { style } } } = useUserConfigContext();
    const { palette: { background } } = nativeTheme.shouldUseDarkColors ? MuiDarkGlobalStyles : MuiLightGlobalStyles;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        popupApi.profile(x, y + height);
    };

    return (
        <IconButton
            onClick={handleButtonClick}
            size={isSingle(style) ? 34 : 32}
            className={clsx('action-button', 'profile')}
            sx={{ borderRadius: '50%' }}
        >
            <Avatar
                src={avatar ?? undefined}
                sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    '& .MuiSvgIcon-root': {
                        color: background.default,
                        fill: background.default
                    }
                }}
            />
        </IconButton>
    );
};

export const MenuButton = () => {
    const { windowApi, popupApi } = useElectronAPI();

    const { config: { appearance: { style } } } = useUserConfigContext();

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        popupApi.windowMenu(x, y + height);
    };

    const handleButtonContextMenu = async (e: MouseEvent<HTMLButtonElement>) => {
        await windowApi.showApplicationMenu();
    };

    return (
        <IconButton
            onClick={handleButtonClick}
            onContextMenu={handleButtonContextMenu}
            size={isSingle(style) ? 34 : 32}
            className={clsx('action-button', 'menu')}
        >
            <MenuMore />
        </IconButton>
    );
};
