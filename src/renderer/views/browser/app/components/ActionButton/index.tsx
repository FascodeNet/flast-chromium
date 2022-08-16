import clsx from 'clsx';
import React, { MouseEvent } from 'react';
import { IconButton } from '../../../../../components/Button';
import { Bookmarks, Download, Extension, History, MenuMore } from '../../../../../components/Icons';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useElectronAPI } from '../../../../../utils/electron';

export const BookmarksButton = () => {
    const { popupApi } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        popupApi.bookmarks(x, y + height);
    };

    return (
        <IconButton onClick={handleButtonClick} className={clsx('action-button', 'bookmarks')}>
            <Bookmarks />
        </IconButton>
    );
};

export const HistoryButton = () => {
    const { popupApi } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        popupApi.history(x, y + height);
    };

    return (
        <IconButton onClick={handleButtonClick} className={clsx('action-button', 'history')}>
            <History />
        </IconButton>
    );
};

export const DownloadsButton = () => {
    const { popupApi } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        popupApi.downloads(x, y + height);
    };

    return (
        <IconButton onClick={handleButtonClick} className={clsx('action-button', 'downloads')}>
            <Download />
        </IconButton>
    );
};

export const ExtensionsButton = () => {
    const { popupApi } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        popupApi.extensions(x, y + height);
    };

    return (
        <IconButton onClick={handleButtonClick} className={clsx('action-button', 'extensions')}>
            <Extension />
        </IconButton>
    );
};

export const MenuButton = () => {
    const { windowApi, popupApi } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

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
            className={clsx('action-button', 'menu')}
        >
            <MenuMore />
        </IconButton>
    );
};
