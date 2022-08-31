import { Box, Button, LinearProgress, Typography, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { enUS, ja } from 'date-fns/locale';
import filesize from 'filesize';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DefaultUserConfig, DownloadData, UserConfig } from '../../../../../../interfaces/user';
import { ExternalLink, Folder, Pause, Play, Remove } from '../../../../../components/Icons';
import {
    ItemContainer,
    ItemFavicon,
    ItemTextBlock,
    PageTitle,
    Section,
    SectionContent,
    SectionTitle
} from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';
import { useDownloadsContext } from '../../contexts/downloads';

interface ItemProps {
    userId: string;
    data: Required<DownloadData>;
}

const Item = ({ userId, data }: ItemProps) => {

    const [download, setDownload] = useState(data);
    const { _id, name, url, path, icon, state, receivedBytes, totalBytes, isPaused } = download;

    useEffect(() => {
        window.flast.downloads.onUpdated(data._id, (e, downloadData) => {
            setDownload(downloadData);
        });

        return () => {
            window.flast.downloads.removeUpdated(data._id);
        };
    }, []);

    const { palette: { mode } } = useTheme();

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.downloads;

    const handleOpenFileClick = () => window.flast.downloads.openFile(userId, _id);
    const handleOpenFolderClick = () => window.flast.downloads.openFolder(userId, _id);
    const handlePauseClick = () => window.flast.downloads.pause(userId, _id);
    const handleResumeClick = () => window.flast.downloads.resume(userId, _id);
    const handleCancelClick = () => window.flast.downloads.cancel(userId, _id);
    const handleRetryClick = () => window.flast.downloads.retry(userId, _id);

    const handleOpenActionClick = () => window.flast.downloads.openAction(_id);
    const handleSaveActionClick = () => window.flast.downloads.saveAction(_id);
    const handleSaveAsActionClick = () => window.flast.downloads.saveAsAction(_id);
    const handleCancelActionClick = () => window.flast.downloads.cancelAction(_id);

    return (
        <ItemContainer sx={{ height: 'unset', minHeight: 60, p: .5 }}>
            <Box
                sx={{
                    width: 42,
                    height: 42,
                    mb: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}
            >
                <ItemFavicon src={icon} />
            </Box>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>
                <ItemTextBlock
                    primary={
                        <span style={{ textDecoration: state !== 'cancelled' ? 'none' : 'line-through' }}>
                            {name}
                        </span>
                    }
                    secondary={url}
                />
                {state === 'progressing' && <Fragment>
                    <LinearProgress
                        value={(receivedBytes / totalBytes) * 100}
                        variant={totalBytes > 0 ? 'determinate' : 'indeterminate'}
                        sx={{ width: '100%', height: 2 }}
                    />
                    <Typography variant="body2" sx={{ userSelect: 'none' }}>
                        {totalBytes > 0 && `${Math.round((receivedBytes / totalBytes) * 100)}% - `}{filesize(receivedBytes)}{totalBytes > 0 && ` / ${filesize(totalBytes)}`}
                    </Typography>
                </Fragment>}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {state === 'completed' && <Fragment>
                        <Button
                            onClick={handleOpenFileClick}
                            startIcon={<ExternalLink />}
                            size="small"
                            variant="contained"
                            disableElevation
                        >
                            {translateSection.openFile}
                        </Button>
                        <Button
                            onClick={handleOpenFolderClick}
                            startIcon={<Folder />}
                            size="small"
                            color="inherit"
                            variant="contained"
                            disableElevation
                            sx={{
                                bgcolor: mode === 'light' ? 'grey.300' : 'grey.800',
                                '&:hover': {
                                    bgcolor: mode === 'light' ? 'grey.A200' : 'grey.A700'
                                }
                            }}
                        >
                            {translateSection.openFolder}
                        </Button>
                    </Fragment>}
                    {state === 'progressing' && <Fragment>
                        <Button
                            onClick={isPaused ? handleResumeClick : handlePauseClick}
                            startIcon={isPaused ? <Play /> : <Pause />}
                            size="small"
                            variant="contained"
                            disableElevation
                        >
                            {isPaused ? translateSection.resume : translateSection.pause}
                        </Button>
                        <Button onClick={handleCancelClick} startIcon={<Remove />} size="small">
                            {translate.common.cancel}
                        </Button>
                    </Fragment>}
                    {state === 'interrupted' && <Button onClick={handleResumeClick} size="small">
                        {translateSection.resume}
                    </Button>}
                    {state === 'cancelled' && <Button onClick={handleRetryClick} size="small">
                        {translateSection.retry}
                    </Button>}
                    {state === 'waiting' && <Fragment>
                        <Button
                            onClick={handleOpenActionClick}
                            startIcon={<ExternalLink />}
                            size="small"
                            variant="contained"
                            disableElevation
                        >
                            {translateSection.openFile}
                        </Button>
                        <Button
                            onClick={handleSaveActionClick}
                            size="small"
                            color="inherit"
                            variant="contained"
                            disableElevation
                            sx={{
                                bgcolor: mode === 'light' ? 'grey.300' : 'grey.800',
                                '&:hover': {
                                    bgcolor: mode === 'light' ? 'grey.A200' : 'grey.A700'
                                }
                            }}
                        >
                            {translateSection.save}
                        </Button>
                        <Button
                            onClick={handleSaveAsActionClick}
                            size="small"
                            color="inherit"
                            variant="contained"
                            disableElevation
                            sx={{
                                bgcolor: mode === 'light' ? 'grey.300' : 'grey.800',
                                '&:hover': {
                                    bgcolor: mode === 'light' ? 'grey.A200' : 'grey.A700'
                                }
                            }}
                        >
                            {translateSection.saveAs}
                        </Button>
                        <Button onClick={handleCancelActionClick} startIcon={<Remove />} size="small">
                            {translate.common.cancel}
                        </Button>
                    </Fragment>}
                </Box>
            </Box>
        </ItemContainer>
    );
};

interface Props {
    title: string;
    filter?: (value: Required<DownloadData>, index: number, array: Required<DownloadData>[]) => boolean;
}

export const ListView = ({ title, filter }: Props) => {

    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { downloadGroups } = useDownloadsContext();

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.downloads;

    useEffect(() => {
        window.flast.user.current().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.flast.user.getConfig(id);
            setConfig(userConfig);
        });
    }, []);

    const groups = downloadGroups.filter(({ list }) => list.some((value, index, array) => !filter || filter(value, index, array)));

    if (!groups || groups.length < 1) {
        return (
            <Fragment>
                <Helmet title={`${title} - ${translateSection.title}`} />
                <PageTitle>{title}</PageTitle>
                <Section>
                    <SectionTitle>{translateSection.notFound}</SectionTitle>
                </Section>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Helmet title={`${title} - ${translateSection.title}`} />
            <PageTitle>{title}</PageTitle>
            {groups.map(({ date, formatDate, list }) => (
                <Section key={formatDate}>
                    <SectionTitle>
                        {format(date, 'yyyy/MM/dd (E)', { locale: config.language.language === 'ja' ? ja : enUS })}
                    </SectionTitle>
                    <SectionContent>
                        {list.filter((value, index, array) => {
                            return !filter || filter(value, index, array);
                        }).map((downloadData) => (
                            <Item key={downloadData._id} userId={userId} data={downloadData} />
                        ))}
                    </SectionContent>
                </Section>
            ))}
        </Fragment>
    );
};
