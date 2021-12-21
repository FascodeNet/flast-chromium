import clsx from 'clsx';
import React, { MouseEvent } from 'react';
import { Bookmarks, Downloads, Extensions, Histories } from '../../../../components/Icons';
import { useElectronAPI } from '../../../../utils/electron';
import { StyledButton } from '../Button/styles';

export const BookmarksButton = () => {
    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {

    };

    return (
        <StyledButton className={clsx('action-button', 'bookmarks')} onClick={handleButtonClick}>
            <Bookmarks />
        </StyledButton>
    );
};

export const HistoriesButton = () => {
    const { showHistoriesPopup } = useElectronAPI();

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        showHistoriesPopup(x, y + height);
    };

    return (
        <StyledButton className={clsx('action-button', 'histories')} onClick={handleButtonClick}>
            <Histories />
        </StyledButton>
    );
};

export const DownloadsButton = () => {
    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    };

    return (
        <StyledButton className={clsx('action-button', 'downloads')} onClick={handleButtonClick}>
            <Downloads />
        </StyledButton>
    );
};

export const ExtensionsButton = () => {
    const handleButtonClick = () => {
    };

    return (
        <StyledButton className={clsx('action-button', 'extensions')} onClick={handleButtonClick}>
            <Extensions />
        </StyledButton>
    );
};
