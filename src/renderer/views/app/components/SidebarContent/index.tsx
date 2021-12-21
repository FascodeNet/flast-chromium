import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { IBookmark, IHistory } from '../../../../../interfaces/user';
import { useElectronAPI } from '../../../../utils/electron';
import {
    StyledHistoryGroup,
    StyledHistoryItem,
    StyledHistoryItemDate,
    StyledHistoryItemFavicon,
    StyledHistoryItemLabel,
    StyledSidebarContainer,
    StyledSidebarContent,
    StyledSidebarHeader,
    StyledSidebarTitle
} from './styles';

export const SidebarBookmarks = () => {
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

    return (
        <StyledSidebarContent className="sidebar-panel">
            <StyledSidebarHeader className="sidebar-panel-header">
                <StyledSidebarTitle>ブックマーク</StyledSidebarTitle>
            </StyledSidebarHeader>
            <StyledSidebarContainer>
                {bookmarks.map((bookmark) => (
                    <div>
                        {bookmark.title}
                    </div>
                ))}
            </StyledSidebarContainer>
        </StyledSidebarContent>
    );
};

interface SortedHistory {
    date: Date;
    histories: IHistory[];
}

interface IDate {
    year: number;
    month: number;
    day: number;
}

export const SidebarHistories = () => {
    const { getCurrentUserId, getHistories } = useElectronAPI();

    const [userId, setUserId] = useState('');
    const [histories, setHistories] = useState(new Map<string, IHistory[]>());

    useEffect(() => {
        getCurrentUserId().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const map = new Map<string, IHistory[]>();

            const histories = await getHistories(id);
            histories.forEach((history) => {
                const date = new Date(history.updatedAt!!);
                const dating = JSON.stringify({
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDate()
                });

                const list = map.get(dating) ?? [];
                list.push(history);
                map.set(dating, list);
            });

            setHistories(map);
        });
    }, []);

    console.log(histories);

    return (
        <StyledSidebarContent className="sidebar-panel">
            <StyledSidebarHeader className="sidebar-panel-header">
                <StyledSidebarTitle>履歴</StyledSidebarTitle>
            </StyledSidebarHeader>
            <StyledSidebarContainer>
                {[...histories.entries()].map((data, i) => {
                    const { year, month, day }: IDate = JSON.parse(data[0]);
                    return (
                        <StyledHistoryGroup key={i}>
                            <h4>{year}/{month}/{day}</h4>
                            {data[1].map(({ title, url, favicon, updatedAt }, v) => (
                                <StyledHistoryItem key={v} className="history-item" title={url}>
                                    <StyledHistoryItemFavicon className="history-item-favicon" favicon={favicon} />
                                    <StyledHistoryItemLabel className="history-item-label">
                                        {title}
                                    </StyledHistoryItemLabel>
                                    <StyledHistoryItemDate className="history-item-date">
                                        {moment(updatedAt).format('HH:mm')}
                                    </StyledHistoryItemDate>
                                </StyledHistoryItem>
                            ))}
                        </StyledHistoryGroup>
                    );
                })}
            </StyledSidebarContainer>
        </StyledSidebarContent>
    );
};

export const SidebarDownloads = () => {
    return (
        <StyledSidebarContent className="sidebar-panel">
            <StyledSidebarHeader className="sidebar-panel-header">
                <StyledSidebarTitle>ダウンロード</StyledSidebarTitle>
            </StyledSidebarHeader>
        </StyledSidebarContent>
    );
};
