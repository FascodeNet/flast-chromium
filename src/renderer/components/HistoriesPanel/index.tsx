import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { IHistory } from '../../../interfaces/user';
import { useElectronAPI } from '../../utils/electron';
import { PanelProps } from '../Panel';
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

export const HistoriesPanel = ({ type }: PanelProps) => {
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
        <StyledPanel className="panel" type={type}>
            <StyledPanelHeader className="panel-header" type={type}>
                <StyledPanelTitle className="panel-title">履歴</StyledPanelTitle>
            </StyledPanelHeader>
            <StyledPanelContainer className="panel-container">
                {[...histories.entries()].map((data, i) => {
                    const { year, month, day }: IDate = JSON.parse(data[0]);
                    return (
                        <StyledHistoryGroup key={i} className="history-group">
                            <h4>{year}/{month + 1}/{day}</h4>
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
            </StyledPanelContainer>
        </StyledPanel>
    );
};
