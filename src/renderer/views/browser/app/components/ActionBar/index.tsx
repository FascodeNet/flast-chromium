import { getCurrentWebContents } from '@electron/remote';
import React from 'react';
import { isHorizontal } from '../../../../../../utils/design';
import { useUserConfigContext } from '../../../../../contexts/config';
import { BookmarksButton, DownloadsButton, ExtensionsButton, HistoryButton, MenuButton } from '../ActionButton';
import { StyledContainer } from './styles';

export const ActionBar = () => {
    const {
        config: {
            appearance: {
                style,
                buttons: { bookmarks, history, downloads, applications, extensions }
            }
        }
    } = useUserConfigContext();

    const allExtensions = getCurrentWebContents().session.getAllExtensions();

    return (
        <StyledContainer className="action-bar" appearanceStyle={style}>
            {isHorizontal(style) && bookmarks && <BookmarksButton />}
            {isHorizontal(style) && history && <HistoryButton />}
            {isHorizontal(style) && downloads && <DownloadsButton />}
            {allExtensions.length > 0 && <ExtensionsButton />}
            <MenuButton />
        </StyledContainer>
    );
};
