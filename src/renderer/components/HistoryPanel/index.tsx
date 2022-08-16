import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_HISTORY } from '../../../constants';
import { HistoryData, HistoryGroup } from '../../../interfaces/user';
import { getTranslate } from '../../../languages/language';
import { useUserConfigContext } from '../../contexts/config';
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

export const HistoryPanel = ({ type }: PanelProps) => {
    const { historyApi, getCurrentUserId } = useElectronAPI();

    const [userId, setUserId] = useState('');
    const [historyGroups, setHistoryGroups] = useState<HistoryGroup[]>([]);

    const { config } = useUserConfigContext();
    const translate = getTranslate(config);
    const translateSection = translate.pages.history;

    useEffect(() => {
        getCurrentUserId().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const historyGroupList = await historyApi.listGroups(id);
            setHistoryGroups(historyGroupList);
        });
    }, []);

    return (
        <StyledPanel className="panel" type={type}>
            <StyledPanelHeader className="panel-header" type={type}>
                <StyledPanelTitle className="panel-title">{translateSection.title}</StyledPanelTitle>
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
