import React, { useEffect, useState } from 'react';
import { IBookmark } from '../../../interfaces/user';
import { useElectronAPI } from '../../utils/electron';
import { PanelProps } from '../Panel';
import { StyledPanel, StyledPanelContainer, StyledPanelHeader, StyledPanelTitle } from '../Panel/styles';
import { StyledBookmarkItem, StyledBookmarkItemFavicon, StyledBookmarkItemLabel } from './styles';

export const BookmarksPanel = ({ type }: PanelProps) => {
    const { getCurrentUserId, getBookmarks } = useElectronAPI();

    const [userId, setUserId] = useState('');
    const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);

    useEffect(() => {
        getCurrentUserId().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const bookmarks = await getBookmarks(id);
            setBookmarks(bookmarks);
        });
    }, []);

    console.log(bookmarks);

    return (
        <StyledPanel className="panel" type={type}>
            <StyledPanelHeader className="panel-header" type={type}>
                <StyledPanelTitle className="panel-title">ブックマーク</StyledPanelTitle>
            </StyledPanelHeader>
            <StyledPanelContainer className="panel-container">
                {bookmarks.map(({ title, url, favicon, parent }, v) => (
                    <StyledBookmarkItem key={v} className="bookmark-item" title={url}>
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
