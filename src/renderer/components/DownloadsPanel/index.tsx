import { shell } from '@electron/remote';
import { Button, LinearProgress } from '@mui/material';
import { ipcRenderer } from 'electron';
import filesize from 'filesize';
import React, { Fragment, useEffect, useState } from 'react';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_DOWNLOADS } from '../../../constants';
import { IPCChannel } from '../../../constants/ipc';
import { DownloadData } from '../../../interfaces/user';
import { getTranslate } from '../../../languages/language';
import { useUserConfigContext } from '../../contexts/config';
import { useElectronAPI } from '../../utils/electron';
import { ExternalLink, Remove } from '../Icons';
import { PanelOpenButton, PanelProps } from '../Panel';
import { StyledPanel, StyledPanelContainer, StyledPanelHeader, StyledPanelTitle } from '../Panel/styles';
import {
    DownloadItem,
    DownloadItemButtonContainer,
    DownloadItemContent,
    DownloadItemIcon,
    DownloadItemIconContainer,
    DownloadItemText,
    DownloadItemTitle
} from './styles';

interface ItemProps {
    data: Required<DownloadData>;
}

const Item = ({ data }: ItemProps) => {
    const { downloadsApi, getCurrentUserId } = useElectronAPI();

    const { userId, config } = useUserConfigContext();
    const translate = getTranslate(config);
    const translateSection = translate.pages.downloads;

    const [download, setDownload] = useState(data);

    useEffect(() => {
        ipcRenderer.on(IPCChannel.Downloads.UPDATED(data._id), (e, downloadData: Required<DownloadData>) => {
            setDownload(downloadData);
        });

        return () => {
            ipcRenderer.removeAllListeners(IPCChannel.Downloads.UPDATED(data._id));
        };
    }, []);

    const handlePauseClick = () => downloadsApi.pause(userId, download._id);
    const handleResumeClick = () => downloadsApi.resume(userId, download._id);
    const handleCancelClick = () => downloadsApi.cancel(userId, download._id);

    return (
        <DownloadItem>
            <DownloadItemIconContainer>
                <DownloadItemIcon src={download.icon} />
            </DownloadItemIconContainer>
            <DownloadItemContent>
                <DownloadItemTitle sx={{ textDecoration: download.state === 'cancelled' ? 'line-through' : 'none' }}>
                    {download.name}
                </DownloadItemTitle>
                {download.state === 'progressing' && <Fragment>
                    <LinearProgress
                        value={(download.receivedBytes / download.totalBytes) * 100}
                        variant={download.totalBytes > 0 ? 'determinate' : 'indeterminate'}
                        sx={{ width: '100%', height: 2 }}
                    />
                    <DownloadItemText>
                        {download.totalBytes > 0 && `${Math.round((download.receivedBytes / download.totalBytes) * 100)}% - `}{filesize(download.receivedBytes)}{download.totalBytes > 0 && ` / ${filesize(download.totalBytes)}`}
                    </DownloadItemText>
                </Fragment>}
                <DownloadItemButtonContainer>
                    {download.state === 'completed' && <Button
                        onClick={() => shell.openPath(download.path)}
                        startIcon={<ExternalLink />}
                        size="small"
                        variant="contained"
                        disableElevation
                    >
                        開く
                    </Button>}
                    {download.state === 'progressing' && <Fragment>
                        <Button
                            onClick={download.isPaused ? handleResumeClick : handlePauseClick}
                            size="small"
                            variant="contained"
                            disableElevation
                        >
                            {download.isPaused ? '再開' : '一時停止'}
                        </Button>
                        <Button
                            onClick={handleCancelClick}
                            startIcon={<Remove />}
                            size="small"
                        >
                            {translate.common.cancel}
                        </Button>
                    </Fragment>}
                    {download.state === 'interrupted' && <Button size="small">再開</Button>}
                    {download.state === 'cancelled' && <Button size="small">再試行</Button>}
                </DownloadItemButtonContainer>
            </DownloadItemContent>
        </DownloadItem>
    );
};

export const DownloadsPanel = ({ type }: PanelProps) => {
    const { downloadsApi, getCurrentUserId } = useElectronAPI();

    const [userId, setUserId] = useState('');
    const [downloads, setDownloads] = useState<Required<DownloadData>[]>([]);

    const { config } = useUserConfigContext();
    const translate = getTranslate(config);
    const translateSection = translate.pages.downloads;

    useEffect(() => {
        getCurrentUserId().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const downloadDataList = await downloadsApi.list(id);
            setDownloads(downloadDataList);
        });
    }, []);

    return (
        <StyledPanel className="panel" type={type}>
            <StyledPanelHeader className="panel-header" type={type}>
                <StyledPanelTitle className="panel-title">{translateSection.title}</StyledPanelTitle>
                <PanelOpenButton url={`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_DOWNLOADS}`} type={type} />
            </StyledPanelHeader>
            <StyledPanelContainer className="panel-container">
                {downloads.map((download) => (
                    <Item key={download._id} data={download} />
                ))}
            </StyledPanelContainer>
        </StyledPanel>
    );
};
