import { Google } from '@mui/icons-material';
import {
    Box,
    Button,
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
import reactStringReplace from 'react-string-replace';
import { DefaultUserConfig, SearchEngine, UserConfig } from '../../../../../../interfaces/user';
import { DeepPartial } from '../../../../../../utils';
import { isURL } from '../../../../../../utils/url';
import { Code } from '../../../../../components/Code';
import { Bookmarks, History } from '../../../../../components/Icons';
import { Save } from '../../../../../components/Icons/object';
import { Add, Edit, Remove } from '../../../../../components/Icons/state';
import {
    ItemContainer,
    ItemFavicon,
    ItemIcon,
    ItemTextBlock,
    PageTitle,
    Section,
    SectionContent,
    SectionTitle,
    SelectItem,
    SwitchItem
} from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';

export const Search = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.searchAndAddressBar;

    const [defaultEngines, setDefaultEngines] = useState(DefaultUserConfig.search.engines);
    const [searchEngines, setSearchEngines] = useState(defaultEngines);

    const [dialogState, setDialogState] = useState<number | undefined>(undefined);
    const [dialogName, setDialogName] = useState('');
    const [dialogUrl, setDialogUrl] = useState('');

    useEffect(() => {
        window.flast.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.flast.getUserConfig(id);
            setConfig(userConfig);

            setDefaultEngines(DefaultUserConfig.search.engines);
            setSearchEngines(userConfig.search.engines);
        });
    }, []);

    const setUserConfig = async (userConfig: DeepPartial<UserConfig>) => {
        setConfig(await window.flast.setUserConfig(userId, userConfig));
    };

    const handleEnginesAddClick = () => {
        setDialogName('');
        setDialogUrl('');
        setDialogState(-1);
    };

    const handleEnginesRemoveClick = async (e: MouseEvent<HTMLButtonElement>, index: number) => {
        await setUserConfig({ search: { engines: undefined } });

        const engines = [...searchEngines];
        engines.splice(index, 1);
        setSearchEngines(engines);

        await setUserConfig({ search: { engines } });
    };

    const handleEngineEditClick = (e: MouseEvent<HTMLButtonElement>, index: number) => {
        setDialogName(searchEngines[index].name);
        setDialogUrl(searchEngines[index].url);
        setDialogState(index);
    };

    const handleEngineDialogSaveClick = async (e: MouseEvent<HTMLButtonElement>) => {
        if (dialogState === undefined) return;

        await setUserConfig({ search: { engines: undefined } });

        if (dialogState >= 0) {
            const engines = [...searchEngines];
            engines[dialogState].name = dialogName;
            engines[dialogState].url = dialogUrl;
            setSearchEngines(engines);

            await setUserConfig({ search: { engines } });
        } else {
            const engines: SearchEngine[] = [...searchEngines, { name: dialogName, url: dialogUrl, mentions: [] }];
            setSearchEngines(engines);

            await setUserConfig({ search: { engines } });
        }

        handleEngineDialogClose();
    };

    const handleEngineDialogCancelClick = (e: MouseEvent<HTMLButtonElement>) => handleEngineDialogClose();

    const handleEngineDialogClose = () => {
        setDialogName('');
        setDialogUrl('');
        setDialogState(undefined);
    };

    const handleEngineDialogNameChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDialogName(e.currentTarget.value.length > 0 ? e.currentTarget.value : '');
    };

    const handleEngineDialogUrlChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDialogUrl(e.currentTarget.value.length > 0 ? e.currentTarget.value : '');
    };

    return (
        <Fragment>
            <Helmet title={`${translateSection.title} - ${translate.pages.settings.title}`} />
            <PageTitle>{translateSection.title}</PageTitle>
            <Section>
                <SectionTitle>{translateSection.suggests.title}</SectionTitle>
                <SectionContent>
                    <SwitchItem
                        icon={<Google />}
                        primary={translateSection.suggests.search}
                        checked={config.search.suggests.search}
                        setChecked={(search) => setUserConfig({ search: { suggests: { search } } })}
                    />
                    <SwitchItem
                        icon={<Bookmarks />}
                        primary={translateSection.suggests.bookmarks}
                        checked={config.search.suggests.bookmarks}
                        setChecked={(bookmarks) => setUserConfig({ search: { suggests: { bookmarks } } })}
                    />
                    <SwitchItem
                        icon={<History />}
                        primary={translateSection.suggests.history}
                        checked={config.search.suggests.history}
                        setChecked={(history) => setUserConfig({ search: { suggests: { history } } })}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translateSection.addressBar.title}</SectionTitle>
                <SectionContent>
                    <SelectItem<number>
                        primary={translateSection.addressBar.defaultEngine}
                        value={config.search.default_engine}
                        setSelected={(defaultEngine) => setUserConfig({ search: { default_engine: defaultEngine } })}
                        choices={searchEngines.map((engine, index) => (
                            { value: index, children: engine.name }
                        ))}
                    />
                    <SwitchItem
                        primary={translateSection.addressBar.suggestEngine.primary}
                        secondary={
                            reactStringReplace(
                                translateSection.addressBar.suggestEngine.secondary,
                                '%k',
                                () => (<Code sx={{ py: 0 }}>Tab</Code>)
                            )
                        }
                        checked={config.search.suggest_engine}
                        setChecked={(suggestEngine) => setUserConfig({ search: { suggest_engine: suggestEngine } })}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>検索エンジン</Box>
                    <Button
                        onClick={handleEnginesAddClick}
                        startIcon={<Add />}
                        variant="contained"
                        sx={{ ml: 'auto' }}
                    >
                        {translate.common.add}
                    </Button>
                </SectionTitle>
                <SectionContent>
                    {searchEngines.map((engine, index) => (
                        <ItemContainer key={index}>
                            <ItemIcon
                                icon={
                                    <ItemFavicon
                                        src={`https://www.google.com/s2/favicons?domain=${new URL(engine.url).hostname}`}
                                    />
                                }
                            />
                            <ItemTextBlock primary={engine.name} secondary={engine.url} />
                            <IconButton onClick={(e) => handleEngineEditClick(e, index)}>
                                <Edit />
                            </IconButton>
                            <IconButton
                                onClick={(e) => handleEnginesRemoveClick(e, index)}
                                disabled={defaultEngines[index] && engine.url === defaultEngines[index].url}
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
                onClose={handleEngineDialogClose}
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
                            onChange={handleEngineDialogNameChange}
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
                            onChange={handleEngineDialogUrlChange}
                            disabled={!dialogState || defaultEngines[dialogState] && dialogUrl === defaultEngines[dialogState].url}
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
                        onClick={handleEngineDialogCancelClick}
                        startIcon={<Remove />}
                    >
                        {translate.common.cancel}
                    </Button>
                    <Button
                        onClick={handleEngineDialogSaveClick}
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
