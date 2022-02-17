import { getCurrentWebContents } from '@electron/remote';
import React from 'react';
import { useUserConfigContext } from '../../../../../contexts/config';
import { BookmarksButton, DownloadsButton, ExtensionsButton, HistoriesButton, MenuButton } from '../ActionButton';
import { StyledContainer } from './styles';

export const ActionBar = () => {
    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const extensions = getCurrentWebContents().session.getAllExtensions();

    return (
        <StyledContainer className="action-bar" appearanceStyle={style}>
            <BookmarksButton />
            <HistoriesButton />
            <DownloadsButton />
            {extensions.length > 0 && <ExtensionsButton />}
            <MenuButton />
        </StyledContainer>
    );
};
