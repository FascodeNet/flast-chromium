import React, { useEffect, useState } from 'react';
import { useElectronAPI } from '../../utils/electron';
import { PanelProps } from '../Panel';
import { StyledPanel, StyledPanelContainer, StyledPanelHeader, StyledPanelTitle } from '../Panel/styles';

export const DownloadsPanel = ({ type }: PanelProps) => {
    const { getCurrentUserId, getBookmarks } = useElectronAPI();

    const [userId, setUserId] = useState('');

    useEffect(() => {
        getCurrentUserId().then(async (id) => {
            if (!id) return;
            setUserId(id);
        });
    }, []);

    return (
        <StyledPanel className="panel" type={type}>
            <StyledPanelHeader className="panel-header" type={type}>
                <StyledPanelTitle className="panel-title">ダウンロード</StyledPanelTitle>
            </StyledPanelHeader>
            <StyledPanelContainer className="panel-container">

            </StyledPanelContainer>
        </StyledPanel>
    );
};
