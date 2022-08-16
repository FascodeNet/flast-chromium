import { shell } from '@electron/remote';
import { Button, LinearProgress } from '@mui/material';
import { ipcRenderer } from 'electron';
import filesize from 'filesize';
import React, { Fragment, useEffect, useState } from 'react';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_DOWNLOADS } from '../../../constants';
import { IPCChannel } from '../../../constants/ipc';
import { NativeDownloadData } from '../../../interfaces/user';
import { getTranslate } from '../../../languages/language';
import { useUserConfigContext } from '../../contexts/config';
import { useElectronAPI } from '../../utils/electron';
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
    data: NativeDownloadData;
}

const Item = ({ data }: ItemProps) => {
    const { downloadsApi, getCurrentUserId } = useElectronAPI();

    const { config } = useUserConfigContext();
    const translate = getTranslate(config);
    const translateSection = translate.pages.downloads;

    const [download, setDownload] = useState(data);

    useEffect(() => {
        ipcRenderer.on(IPCChannel.Downloads.UPDATED(data._id), (e, downloadData: NativeDownloadData) => {
            setDownload(downloadData);
        });

        return () => {
            ipcRenderer.removeAllListeners(IPCChannel.Downloads.UPDATED(data._id));
        };
    }, []);

    const handlePauseClick = () => downloadsApi.pause(download._id);
    const handleResumeClick = () => downloadsApi.resume(download._id);
    const handleCancelClick = () => downloadsApi.cancel(download._id);

    return (
        <DownloadItem>
            <DownloadItemIconContainer>
                <DownloadItemIcon src={download.icon?.toDataURL()} />
            </DownloadItemIconContainer>
            <DownloadItemContent>
                <DownloadItemTitle sx={{ textDecoration: download.state === 'cancelled' ? 'line-through' : 'none' }}>
                    {download.name}
                </DownloadItemTitle>
                {download.state === 'progressing' ? <Fragment>
                    <LinearProgress
                        value={(download.receivedBytes / download.totalBytes) * 100}
                        variant={download.totalBytes > 0 ? 'determinate' : 'indeterminate'}
                        sx={{ width: '100%', height: 2 }}
                    />
                    <DownloadItemText>
                        {filesize(download.receivedBytes)}{download.totalBytes > 0 && ` / ${filesize(download.totalBytes)}`}
                    </DownloadItemText>
                    <DownloadItemButtonContainer>
                        <Button
                            onClick={download.isPaused ? handleResumeClick : handlePauseClick}
                            size="small"
                            variant="contained"
                            disableElevation
                        >
                            {download.isPaused ? '再開' : '一時停止'}
                        </Button>
                        <Button onClick={handleCancelClick} size="small">{translate.common.cancel}</Button>
                    </DownloadItemButtonContainer>
                </Fragment> : <DownloadItemButtonContainer>
                    <Button
                        onClick={() => shell.openPath(download.path)}
                        size="small"
                        variant="contained"
                        disableElevation
                    >
                        開く
                    </Button>
                </DownloadItemButtonContainer>}
            </DownloadItemContent>
        </DownloadItem>
    );
};

export const DownloadsPanel = ({ type }: PanelProps) => {
    const { downloadsApi, getCurrentUserId } = useElectronAPI();

    const [userId, setUserId] = useState('');
    const [downloads, setDownloads] = useState<NativeDownloadData[]>([]);

    const { config } = useUserConfigContext();
    const translate = getTranslate(config);
    const translateSection = translate.pages.downloads;

    useEffect(() => {
        getCurrentUserId().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const downloadDataList = await downloadsApi.listWithFileIcon(id);
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
