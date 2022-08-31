import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    IconButton,
    TextField
} from '@mui/material';
import React, { ChangeEvent, Fragment, MouseEvent, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { AdBlockerFilter, DefaultUserConfig, UserConfig } from '../../../../../../interfaces/user';
import { DeepPartial } from '../../../../../../utils';
import { isURL } from '../../../../../../utils/url';
import { Add, Edit, Remove, Save } from '../../../../../components/Icons';
import {
    ItemContainer,
    ItemTextBlock,
    PageTitle,
    Section,
    SectionContent,
    SectionTitle,
    SwitchItem
} from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';

export const AdBlocker = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.adBlocker;

    const [defaultFilters, setDefaultFilters] = useState(DefaultUserConfig.ad_blocker.filters);
    const [adBlockFilters, setAdBlockFilters] = useState(defaultFilters);

    const [dialogState, setDialogState] = useState<number | undefined>(undefined);
    const [dialogName, setDialogName] = useState('');
    const [dialogUrl, setDialogUrl] = useState('');

    useEffect(() => {
        window.flast.user.current().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.flast.user.getConfig(id);
            setConfig(userConfig);

            setDefaultFilters(DefaultUserConfig.ad_blocker.filters);
            setAdBlockFilters(userConfig.ad_blocker.filters);
        });
    }, []);

    const setUserConfig = async (userConfig: DeepPartial<UserConfig>) => {
        setConfig(await window.flast.user.setConfig(userId, userConfig));
    };

    const handleFiltersAddClick = () => {
        setDialogName('');
        setDialogUrl('');
        setDialogState(-1);
    };

    const handleFiltersRemoveClick = async (e: MouseEvent<HTMLButtonElement>, index: number) => {
        await setUserConfig({ ad_blocker: { filters: undefined } });

        const filters = [...adBlockFilters];
        filters.splice(index, 1);
        setAdBlockFilters(filters);

        await setUserConfig({ ad_blocker: { filters } });
    };

    const handleFilterToggleClick = async (e: ChangeEvent<HTMLInputElement>, index: number) => {
        await setUserConfig({ ad_blocker: { filters: undefined } });

        const filters = [...adBlockFilters];
        filters[index].enabled = !e.target.checked;
        setAdBlockFilters(filters);

        await setUserConfig({ ad_blocker: { filters } });
    };

    const handleFilterEditClick = (e: MouseEvent<HTMLButtonElement>, index: number) => {
        setDialogName(adBlockFilters[index].name);
        setDialogUrl(adBlockFilters[index].url);
        setDialogState(index);
    };

    const handleFilterDialogSaveClick = async (e: MouseEvent<HTMLButtonElement>) => {
        if (dialogState === undefined) return;

        await setUserConfig({ ad_blocker: { filters: undefined } });

        if (dialogState >= 0) {
            const filters = [...adBlockFilters];
            filters[dialogState].name = dialogName;
            filters[dialogState].url = dialogUrl;
            setAdBlockFilters(filters);

            await setUserConfig({ ad_blocker: { filters } });
        } else {
            const filters: AdBlockerFilter[] = [...adBlockFilters, { name: dialogName, url: dialogUrl, enabled: true }];
            setAdBlockFilters(filters);

            await setUserConfig({ ad_blocker: { filters } });
        }

        handleFilterDialogClose();
    };

    const handleFilterDialogCancelClick = (e: MouseEvent<HTMLButtonElement>) => handleFilterDialogClose();

    const handleFilterDialogClose = () => {
        setDialogName('');
        setDialogUrl('');
        setDialogState(undefined);
    };

    const handleFilterDialogNameChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDialogName(e.currentTarget.value.length > 0 ? e.currentTarget.value : '');
    };

    const handleFilterDialogUrlChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDialogUrl(e.currentTarget.value.length > 0 ? e.currentTarget.value : '');
    };

    return (
        <Fragment>
            <Helmet title={`${translateSection.title} - ${translate.pages.settings.title}`} />
            <PageTitle>{translateSection.title}</PageTitle>
            <Section>
                <SwitchItem
                    primary={translateSection.enabled}
                    checked={config.ad_blocker.enabled}
                    setChecked={(enabled) => setUserConfig({ ad_blocker: { enabled } })}
                />
            </Section>
            <Section>
                <SectionTitle sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>{translateSection.filters}</Box>
                    <Button
                        onClick={handleFiltersAddClick}
                        disabled={!config.ad_blocker.enabled}
                        startIcon={<Add />}
                        variant="contained"
                        sx={{ ml: 'auto' }}
                    >
                        {translate.common.add}
                    </Button>
                </SectionTitle>
                <SectionContent>
                    {adBlockFilters.map((filter, index) => (
                        <ItemContainer key={index} sx={{ pl: .5 }}>
                            <Checkbox
                                checked={filter.enabled}
                                onChange={(e) => handleFilterToggleClick(e, index)}
                                disabled={!config.ad_blocker.enabled}
                            />
                            <ItemTextBlock primary={filter.name} secondary={filter.url} />
                            <IconButton
                                onClick={(e) => handleFilterEditClick(e, index)}
                                disabled={!config.ad_blocker.enabled}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton
                                onClick={(e) => handleFiltersRemoveClick(e, index)}
                                disabled={!config.ad_blocker.enabled || defaultFilters[index] && filter.url === defaultFilters[index].url}
                                color="error"
                            >
                                <Remove />
                            </IconButton>
                        </ItemContainer>
                    ))}
                </SectionContent>
            </Section>

            <Dialog
                open={dialogState !== undefined}
                onClose={handleFilterDialogClose}
                disableEscapeKeyDown
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 300 }}>ページの編集</DialogTitle>
                <DialogContent
                    sx={{
                        pt: '4px !important',
                        pb: '12px !important',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <FormControl
                        variant="standard"
                        fullWidth
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: .5
                        }}
                    >
                        <FormLabel component="legend" sx={{ width: '100%' }}>名前</FormLabel>
                        <TextField
                            value={dialogName}
                            onChange={handleFilterDialogNameChange}
                            type="text"
                            placeholder="名前"
                            fullWidth
                            size="small"
                            margin="none"
                            variant="outlined"
                        />
                    </FormControl>
                    <FormControl
                        variant="standard"
                        fullWidth
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: .5
                        }}
                    >
                        <FormLabel component="legend" sx={{ width: '100%' }}>URL</FormLabel>
                        <TextField
                            value={dialogUrl}
                            onChange={handleFilterDialogUrlChange}
                            disabled={!dialogState || defaultFilters[dialogState] && dialogUrl === defaultFilters[dialogState].url}
                            type="url"
                            placeholder="URL"
                            fullWidth
                            size="small"
                            margin="none"
                            variant="outlined"
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleFilterDialogCancelClick}
                        startIcon={<Remove />}
                    >
                        {translate.common.cancel}
                    </Button>
                    <Button
                        onClick={handleFilterDialogSaveClick}
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
