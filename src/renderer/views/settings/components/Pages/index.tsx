import { EditOutlined } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    styled,
    TextField,
    Typography
} from '@mui/material';
import React, { ChangeEvent, Fragment, MouseEvent, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DefaultUserConfig, HomeButtonPageMode, StartupPageMode, UserConfig } from '../../../../../interfaces/user';
import { DeepPartial } from '../../../../../utils';
import { isURL } from '../../../../../utils/url';
import { Home } from '../../../../components/Icons';
import { Save } from '../../../../components/Icons/object';
import { Add, Remove } from '../../../../components/Icons/state';
import {
    ItemContainer as BaseItemContainer,
    PageTitle,
    RadioItem,
    Section,
    SectionContent,
    SectionTitle,
    SwitchItem
} from '../../../../components/Page';
import { useTranslateContext } from '../../../../contexts/translate';

const ItemContainer = styled(BaseItemContainer)(({ theme }) => ({
    height: 'unset',
    minHeight: 50,
    padding: theme.spacing(.5, 2, .5, 7)
}));

export const Pages = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.pages;

    const [startupUrls, setStartupUrls] = useState<string[]>([]);
    const [isHomeUrlValidated, setHomeUrlValidated] = useState(true);

    const [dialogState, setDialogState] = useState<number | undefined>(undefined);
    const [dialogUrl, setDialogUrl] = useState('');

    useEffect(() => {
        window.api.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.api.getUserConfig(id);
            setConfig(userConfig);

            setStartupUrls(userConfig.pages.startup.urls);

            const homeUrl = userConfig.pages.home.url;
            const validated = !config.appearance.buttons.home || config.pages.home.mode !== 'custom' || !homeUrl || isURL(homeUrl);
            setHomeUrlValidated(validated);
        });
    }, []);

    const setUserConfig = async (userConfig: DeepPartial<UserConfig>) => {
        setConfig(await window.api.setUserConfig(userId, userConfig));
    };

    const handleStartupUrlsAddClick = () => {
        setDialogState(-1);
        setDialogUrl('');
    };

    const handleStartupUrlsRemoveClick = async (e: MouseEvent<HTMLButtonElement>, index: number) => {
        await setUserConfig({ pages: { startup: { urls: undefined } } });

        const urls = startupUrls;
        urls.splice(index, 1);
        setStartupUrls(urls);

        await setUserConfig({ pages: { startup: { urls } } });
    };

    const handleStartupUrlEditClick = (e: MouseEvent<HTMLButtonElement>, index: number) => {
        setDialogState(index);
        setDialogUrl(startupUrls[index]);
    };

    const handleStartupDialogSaveClick = async (e: MouseEvent<HTMLButtonElement>) => {
        if (dialogState === undefined) return;

        await setUserConfig({ pages: { startup: { urls: undefined } } });

        if (dialogState >= 0) {
            const urls = [...startupUrls];
            urls[dialogState] = dialogUrl;
            setStartupUrls(urls);

            await setUserConfig({ pages: { startup: { urls } } });
        } else {
            const urls = [...startupUrls, dialogUrl];
            setStartupUrls(urls);

            await setUserConfig({ pages: { startup: { urls } } });
        }

        handleStartupUrlDialogClose();
    };

    const handleStartupDialogCancelClick = (e: MouseEvent<HTMLButtonElement>) => handleStartupUrlDialogClose();

    const handleStartupUrlDialogClose = () => {
        setDialogState(undefined);
        setDialogUrl('');
    };

    const handleStartupUrlDialogChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDialogUrl(e.currentTarget.value.length > 0 ? e.currentTarget.value : '');
    };

    return (
        <Fragment>
            <Helmet title={`${translateSection.title} - ${translate.pages.settings.title}`} />
            <PageTitle>{translateSection.title}</PageTitle>
            <Section>
                <SectionTitle>{translateSection.startup.title}</SectionTitle>
                <SectionContent>
                    <RadioItem<StartupPageMode>
                        primary={translateSection.startup.newTab}
                        name="startup"
                        value="new_tab"
                        selectedValue={config.pages.startup.mode}
                        setSelected={(mode) => setUserConfig({ pages: { startup: { mode } } })}
                    />
                    <RadioItem<StartupPageMode>
                        primary={translateSection.startup.prevSessions}
                        name="startup"
                        value="prev_sessions"
                        selectedValue={config.pages.startup.mode}
                        setSelected={(mode) => setUserConfig({ pages: { startup: { mode } } })}
                    />
                    <RadioItem<StartupPageMode>
                        primary={translateSection.startup.custom}
                        name="startup"
                        value="custom"
                        selectedValue={config.pages.startup.mode}
                        setSelected={(mode) => setUserConfig({ pages: { startup: { mode } } })}
                    />
                    <ItemContainer sx={{ display: 'flex', alignItems: 'center' }}>
                        <SectionTitle variant="h6">ページ</SectionTitle>
                        <Button
                            onClick={handleStartupUrlsAddClick}
                            disabled={config.pages.startup.mode !== 'custom'}
                            startIcon={<Add />}
                            variant="contained"
                            sx={{ ml: 'auto' }}
                        >
                            ページを追加
                        </Button>
                    </ItemContainer>
                    {startupUrls.map((url, index) => (
                        <ItemContainer key={index}>
                            <Typography variant="body1" align="left" sx={{ width: '100%', userSelect: 'none' }}>
                                {url}
                            </Typography>
                            <IconButton
                                onClick={(e) => handleStartupUrlEditClick(e, index)}
                                disabled={config.pages.startup.mode !== 'custom'}
                            >
                                <EditOutlined />
                            </IconButton>
                            <IconButton
                                onClick={(e) => handleStartupUrlsRemoveClick(e, index)}
                                disabled={config.pages.startup.mode !== 'custom'}
                                color="error"
                            >
                                <Remove />
                            </IconButton>
                        </ItemContainer>
                    ))}
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translateSection.home.title}</SectionTitle>
                <SectionContent>
                    <SwitchItem
                        icon={<Home />}
                        primary={translateSection.home.button.name}
                        secondary={translateSection.home.button.description}
                        checked={config.appearance.buttons.home}
                        setChecked={(home) => setUserConfig({ appearance: { buttons: { home } } })}
                    />
                    <RadioItem<HomeButtonPageMode>
                        primary={translateSection.home.newTab}
                        name="home"
                        value="new_tab"
                        selectedValue={config.pages.home.mode}
                        setSelected={(mode) => setUserConfig({ pages: { home: { mode } } })}
                        disabled={!config.appearance.buttons.home}
                    />
                    <RadioItem<HomeButtonPageMode>
                        primary={translateSection.home.custom}
                        name="home"
                        value="custom"
                        selectedValue={config.pages.home.mode}
                        setSelected={(mode) => setUserConfig({ pages: { home: { mode } } })}
                        disabled={!config.appearance.buttons.home}
                    />
                    <ItemContainer>
                        <TextField
                            value={config.pages.home.url ?? ''}
                            onChange={(e) => {
                                const url = e.currentTarget.value.length > 0 ? e.currentTarget.value : undefined;
                                const validated = !config.appearance.buttons.home || config.pages.home.mode !== 'custom' || !url || isURL(url);

                                setHomeUrlValidated(validated);
                                setUserConfig({ pages: { home: { url } } });
                            }}
                            type="url"
                            placeholder="URL"
                            error={!isHomeUrlValidated}
                            helperText={!isHomeUrlValidated && '正しいURLを入力してください'}
                            disabled={!config.appearance.buttons.home || config.pages.home.mode !== 'custom'}
                            fullWidth
                            size="small"
                            margin="none"
                            variant="outlined"
                        />
                    </ItemContainer>
                </SectionContent>
            </Section>

            <Dialog open={dialogState !== undefined} onClose={handleStartupUrlDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 300 }}>ページの編集</DialogTitle>
                <DialogContent
                    sx={{
                        pt: '4px !important',
                        pb: '12px !important',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <DialogContentText sx={{ width: '100%', fontWeight: 100 }}>
                        URL を入力してください。
                    </DialogContentText>
                    <TextField
                        value={dialogUrl}
                        onChange={handleStartupUrlDialogChange}
                        type="url"
                        placeholder="URL"
                        fullWidth
                        size="small"
                        margin="none"
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleStartupDialogCancelClick}
                        startIcon={<Remove />}
                    >
                        {translate.common.cancel}
                    </Button>
                    <Button
                        onClick={handleStartupDialogSaveClick}
                        disabled={!isURL(dialogUrl)}
                        startIcon={<Save />}
                        variant="contained"
                    >
                        {translate.common.save}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};
