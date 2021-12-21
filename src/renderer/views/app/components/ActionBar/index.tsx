import React from 'react';
import { useUserConfigContext } from '../../../../contexts/config';
import { BookmarksButton, DownloadsButton, HistoriesButton } from '../ActionButton';
import { StyledContainer } from './styles';

export const ActionBar = () => {
    const { config } = useUserConfigContext();

    return (
        <StyledContainer className="action-bar">
            <BookmarksButton />
            <HistoriesButton />
            <DownloadsButton />
        </StyledContainer>
    );
};
