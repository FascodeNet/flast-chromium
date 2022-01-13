import clsx from 'clsx';
import React, { MouseEvent } from 'react';
import { Bookmarks, Downloads, Extensions, Histories } from '../../../../components/Icons';
import { useUserConfigContext } from '../../../../contexts/config';
import { useElectronAPI } from '../../../../utils/electron';
import { StyledButton } from '../Button/styles';

export const BookmarksButton = () => {
    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {

    };

    return (
        <StyledButton className={clsx('action-button', 'bookmarks')} appearanceStyle={style}
                      onClick={handleButtonClick}>
            <Bookmarks />
        </StyledButton>
    );
};

export const HistoriesButton = () => {
    const { showHistoriesPopup } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        showHistoriesPopup(x, y + height);
    };

    return (
        <StyledButton className={clsx('action-button', 'histories')} appearanceStyle={style}
                      onClick={handleButtonClick}>
            <Histories />
        </StyledButton>
    );
};

export const DownloadsButton = () => {
    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    };

    return (
        <StyledButton className={clsx('action-button', 'downloads')} appearanceStyle={style}
                      onClick={handleButtonClick}>
            <Downloads />
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
        <StyledButton className={clsx('action-button', 'extensions')} appearanceStyle={style}
                      onClick={handleButtonClick}>
            <Extensions />
        </StyledButton>
    );
};
