import { getCurrentWebContents } from '@electron/remote';
import React from 'react';
import { useUserConfigContext } from '../../../../../contexts/config';
import { BookmarksButton, DownloadsButton, ExtensionsButton, HistoriesButton, MenuButton } from '../ActionButton';
import { StyledContainer } from './styles';

export const ActionBar = () => {
    const {
        config: {
            appearance: {
                style,
                buttons: { bookmarks, histories, downloads, applications, extensions }
            }
        }
    } = useUserConfigContext();

    const allExtensions = getCurrentWebContents().session.getAllExtensions();

    return (
        <StyledContainer className="action-bar" appearanceStyle={style}>
            {bookmarks && <BookmarksButton />}
            {histories && <HistoriesButton />}
            {downloads && <DownloadsButton />}
            {allExtensions.length > 0 && <ExtensionsButton />}
            <MenuButton />
        </StyledContainer>
    );
};
