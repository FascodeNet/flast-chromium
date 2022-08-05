import { Avatar, Box, Button, Paper, TextField, Typography, useTheme } from '@mui/material';
import React, { ChangeEvent, Fragment, KeyboardEvent, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DefaultUserConfig, UserConfig } from '../../../../../../interfaces/user';
import { DeepPartial } from '../../../../../../utils';
import { Save } from '../../../../../components/Icons/object';
import { Edit, Remove } from '../../../../../components/Icons/state';
import { PageTitle, Section, SectionContent } from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';

export const ProfileAndUsers = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.profileAndUsers;

    const { palette: { mode, grey }, typography } = useTheme();

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(config.profile.name);

    useEffect(() => {
        window.flast.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.flast.getUserConfig(id);
            setConfig(userConfig);
            setName(userConfig.profile.name);
        });
    }, []);

    const setUserConfig = async (userConfig: DeepPartial<UserConfig>) => {
        setConfig(await window.flast.setUserConfig(userId, userConfig));
    };

    const handleTextFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(e.currentTarget.value);

    const handleTextFieldKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.nativeEvent.isComposing) return;

        switch (e.key) {
            case 'Escape':
                handleCancelClick();
                return;
            case 'Enter':
                handleSaveClick();
                return;
        }
    };

    const handleSaveClick = () => {
        if (!name || name.length < 1) return;
        setUserConfig({ profile: { name } });
        setEditing(false);
    };

    const handleCancelClick = () => {
        setName(config.profile.name);
        setEditing(false);
    };

    const handleEditClick = () => setEditing(true);

    return (
        <Fragment>
            <Helmet title={`${translateSection.title} - ${translate.pages.settings.title}`} />
            <PageTitle>{translateSection.title}</PageTitle>
            <Section>
                <SectionContent>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            bgcolor: mode === 'light' ? grey['100'] : grey['900']
                        }}
                    >
                        <Avatar src={config.profile.avatar ?? undefined} sx={{ width: 64, height: 64 }} />
                        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                            {editing ? <Fragment>
                                <TextField
                                    value={name}
                                    onChange={handleTextFieldChange}
                                    onKeyDown={handleTextFieldKeyDown}
                                    sx={{
                                        '& .MuiOutlinedInput-input': {
                                            ...typography.h5,
                                            p: 1,
                                            fontWeight: 300
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleCancelClick}
                                    startIcon={<Remove />}
                                    sx={{ ml: 'auto', flexShrink: 0 }}
                                >
                                    {translate.common.cancel}
                                </Button>
                                <Button
                                    onClick={handleSaveClick}
                                    disabled={!name || name.length < 1}
                                    variant="contained"
                                    startIcon={<Save />}
                                    sx={{ flexShrink: 0 }}
                                >
                                    {translate.common.save}
                                </Button>
                            </Fragment> : <Fragment>
                                <Typography variant="h5" sx={{ fontWeight: 300 }}>{config.profile.name}</Typography>
                                <Button
                                    onClick={handleEditClick}
                                    variant="contained"
                                    startIcon={<Edit />}
                                    sx={{ ml: 'auto' }}
                                >
                                    {translate.common.edit}
                                </Button>
                            </Fragment>}
                        </Box>
                    </Paper>
                </SectionContent>
            </Section>
        </Fragment>
    );
};
