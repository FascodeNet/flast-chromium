import clsx from 'clsx';
import React, { MouseEvent } from 'react';
import { Bookmarks, Download, Extension, History, MenuMore } from '../../../../../components/Icons';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledButton } from '../Button/styles';

export const BookmarksButton = () => {
    const { showBookmarksPopup } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        showBookmarksPopup(x, y + height);
    };

    return (
        <StyledButton
            onClick={handleButtonClick}
            appearanceStyle={style}
            className={clsx('action-button', 'bookmarks')}
        >
            <Bookmarks />
        </StyledButton>
    );
};

export const HistoryButton = () => {
    const { showHistoryPopup } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        showHistoryPopup(x, y + height);
    };

    return (
        <StyledButton
            onClick={handleButtonClick}
            appearanceStyle={style}
            className={clsx('action-button', 'history')}
        >
            <History />
        </StyledButton>
    );
};

export const DownloadsButton = () => {
    const { showDownloadsPopup } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        showDownloadsPopup(x, y + height);
    };

    return (
        <StyledButton
            onClick={handleButtonClick}
            appearanceStyle={style}
            className={clsx('action-button', 'downloads')}
        >
            <Download />
        </StyledButton>
    );
};

export const ExtensionsButton = () => {
    const { showExtensionsPopup } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        showExtensionsPopup(x, y + height);
    };

    return (
        <StyledButton
            onClick={handleButtonClick}
            appearanceStyle={style}
            className={clsx('action-button', 'extensions')}
        >
            <Extension />
        </StyledButton>
    );
};

export const MenuButton = () => {
    const { showMenuPopup, showApplicationMenu } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        showMenuPopup(x, y + height);
    };

    const handleButtonContextMenu = async (e: MouseEvent<HTMLButtonElement>) => {
        await showApplicationMenu();
    };

    return (
        <StyledButton
            onClick={handleButtonClick}
            onContextMenu={handleButtonContextMenu}
            appearanceStyle={style}
            className={clsx('action-button', 'menu')}
        >
            <MenuMore />
        </StyledButton>
    );
};
