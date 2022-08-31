import React, { useEffect, useState } from 'react';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_BOOKMARKS } from '../../../constants';
import { BookmarkData } from '../../../interfaces/user';
import { getTranslate } from '../../../languages/language';
import { useUserConfigContext } from '../../contexts/config';
import { useElectronAPI } from '../../utils/electron';
import { Folder } from '../Icons/object';
import { PanelOpenButton, PanelProps } from '../Panel';
import { StyledPanel, StyledPanelContainer, StyledPanelHeader, StyledPanelTitle } from '../Panel/styles';
import {
    StyledBookmarkItem,
    StyledBookmarkItemFavicon,
    StyledBookmarkItemIcon,
    StyledBookmarkItemLabel
} from './styles';

export const BookmarksPanel = ({ type }: PanelProps) => {
    const { bookmarksApi, getCurrentUserId } = useElectronAPI();

    const [userId, setUserId] = useState('');
    const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);

    const { config } = useUserConfigContext();
    const translate = getTranslate(config);
    const translateSection = translate.pages.bookmarks;

    const [folderId, setFolderId] = useState<string | undefined>(undefined);

    useEffect(() => {
        getCurrentUserId().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const bookmarkDataList = await bookmarksApi.list(id);
            setBookmarks(bookmarkDataList);
        });
    }, []);


    const folder = (folderId ? bookmarks.find((bookmark) => bookmark._id === folderId && bookmark.isFolder) : {
        title: translateSection.all
    }) as Required<BookmarkData> | undefined;

    const items = bookmarks.filter((bookmark) => bookmark.parent === folderId)
        .map((bookmark) => (bookmark) as Required<BookmarkData>)
        .sort((a, b) => a.title.localeCompare(b.title, 'ja'));
    const folderItems = items.filter((bookmark) => bookmark.isFolder);
    const bookmarkItems = items.filter((bookmark) => !bookmark.isFolder);

    return (
        <StyledPanel className="panel" type={type}>
            <StyledPanelHeader className="panel-header" type={type}>
                <StyledPanelTitle className="panel-title">{translateSection.title}</StyledPanelTitle>
                <PanelOpenButton url={`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_BOOKMARKS}`} type={type} />
            </StyledPanelHeader>
            <StyledPanelContainer className="panel-container">
                {folderItems.map(({ _id, title, url, favicon, parent }) => (
                    <StyledBookmarkItem key={_id} className="bookmark-item" onClick={() => setFolderId(_id)}>
                        <StyledBookmarkItemIcon className="bookmark-item-icon">
                            <Folder />
                        </StyledBookmarkItemIcon>
                        <StyledBookmarkItemLabel className="bookmark-item-label">
                            {title}
                        </StyledBookmarkItemLabel>
                    </StyledBookmarkItem>
                ))}
                {bookmarkItems.map(({ _id, title, url, favicon, parent }, v) => (
                    <StyledBookmarkItem key={_id} className="bookmark-item" title={url}>
                        <StyledBookmarkItemFavicon className="bookmark-item-favicon" favicon={favicon} />
                        <StyledBookmarkItemLabel className="bookmark-item-label">
                            {title}
                        </StyledBookmarkItemLabel>
                    </StyledBookmarkItem>
                ))}
            </StyledPanelContainer>
        </StyledPanel>
    );
};
