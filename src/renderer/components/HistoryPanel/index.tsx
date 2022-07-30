import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { HistoryData, HistoryGroup } from '../../../interfaces/user';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_HISTORY } from '../../../utils';
import { useElectronAPI } from '../../utils/electron';
import { PanelOpenButton, PanelProps } from '../Panel';
import { StyledPanel, StyledPanelContainer, StyledPanelHeader, StyledPanelTitle } from '../Panel/styles';
import {
    StyledHistoryGroup,
    StyledHistoryItem,
    StyledHistoryItemDate,
    StyledHistoryItemFavicon,
    StyledHistoryItemLabel
} from './styles';

interface IDate {
    year: number;
    month: number;
    day: number;
}

export const HistoryPanel = ({ type }: PanelProps) => {
    const { getCurrentUserId, getHistoryGroups } = useElectronAPI();

    const [userId, setUserId] = useState('');

    const [historyGroups, setHistoryGroups] = useState<HistoryGroup[]>([]);

    useEffect(() => {
        getCurrentUserId().then(async (id) => {
            if (!id) return;
            setUserId(id);

            setHistoryGroups(await getHistoryGroups(id));
        });
    }, []);

    return (
        <StyledPanel className="panel" type={type}>
            <StyledPanelHeader className="panel-header" type={type}>
                <StyledPanelTitle className="panel-title">履歴</StyledPanelTitle>
                <PanelOpenButton url={`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HISTORY}`} type={type} />
            </StyledPanelHeader>
            <StyledPanelContainer className="panel-container">
                {historyGroups.map(({ formatDate, history }) => (
                    <StyledHistoryGroup key={formatDate} className="history-group">
                        <h4>{formatDate}</h4>
                        {history.map(({ _id, title, url, favicon, updatedAt }: HistoryData) => (
                            <StyledHistoryItem key={_id} className="history-item" title={url}>
                                <StyledHistoryItemFavicon className="history-item-favicon" favicon={favicon} />
                                <StyledHistoryItemLabel className="history-item-label">
                                    {title}
                                </StyledHistoryItemLabel>
                                <StyledHistoryItemDate className="history-item-date">
                                    {format(updatedAt!!, 'HH:mm')}
                                </StyledHistoryItemDate>
                            </StyledHistoryItem>
                        ))}
                    </StyledHistoryGroup>
                ))}
            </StyledPanelContainer>
        </StyledPanel>
    );
};
