import { getCurrentWebContents } from '@electron/remote';
import React from 'react';
import { isHorizontalTabContainer } from '../../../../../../utils/design';
import { useUserConfigContext } from '../../../../../contexts/config';
import {
    BookmarksButton,
    DownloadsButton,
    ExtensionsButton,
    HistoryButton,
    MenuButton,
    ProfileButton
} from '../ActionButton';
import { StyledContainer } from './styles';

export const ActionBar = () => {
    const {
        config: {
            appearance: {
                tab_container: { position },
                buttons: { bookmarks, history, downloads, applications, extensions }
            }
        }
    } = useUserConfigContext();

    const allExtensions = getCurrentWebContents().session.getAllExtensions();

    return (
        <StyledContainer className="action-bar">
            {isHorizontalTabContainer(position) && bookmarks && <BookmarksButton />}
            {isHorizontalTabContainer(position) && history && <HistoryButton />}
            {isHorizontalTabContainer(position) && downloads && <DownloadsButton />}
            {allExtensions.length > 0 && <ExtensionsButton />}
            <ProfileButton />
            <MenuButton />
        </StyledContainer>
    );
};
