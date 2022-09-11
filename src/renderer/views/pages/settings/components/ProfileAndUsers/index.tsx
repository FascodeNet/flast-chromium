import { Avatar, Box, Button, ButtonBase, Paper, TextField, Typography, useTheme } from '@mui/material';
import deepmerge from 'deepmerge';
import { nanoid } from 'nanoid';
import React, { ChangeEvent, Fragment, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { APPLICATION_PROTOCOL, APPLICATION_RESOURCE_AVATAR } from '../../../../../../constants';
import { DefaultUserConfig, UserConfig, UserData } from '../../../../../../interfaces/user';
import { DeepPartial } from '../../../../../../utils';
import { Edit, Remove, Save } from '../../../../../components/Icons';
import { LinkItem, PageTitle, Section, SectionContent, SectionTitle } from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';

export const ProfileAndUsers = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.profileAndUsers;

    const { palette: { mode, grey }, typography } = useTheme();

    const [users, setUsers] = useState<UserData[]>([]);

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(config.profile.name);
    const [avatar, setAvatar] = useState(config.profile.avatar ? `${APPLICATION_PROTOCOL}://${APPLICATION_RESOURCE_AVATAR}/${nanoid()}` : null);

    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        window.flast.user.current().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.flast.user.getConfig(id);
            setConfig(userConfig);
            setName(userConfig.profile.name);
            setAvatar(userConfig.profile.avatar ? `${APPLICATION_PROTOCOL}://${APPLICATION_RESOURCE_AVATAR}/${nanoid()}` : null);
        });

        window.flast.users.list().then((userDataList) => setUsers(userDataList));
    }, []);

    const setUserConfig = async (userConfig: DeepPartial<UserConfig>) => {
        setConfig(await window.flast.user.setConfig(userId, userConfig));
    };

    const handleInputFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            setAvatar(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setAvatar(typeof reader.result === 'string' ? reader.result : null);
        };

        reader.readAsDataURL(e.target.files[0]);
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

    const handleSaveClick = async () => {
        if (!name || name.length < 1) return;

        setEditing(false);

        const profile = await window.flast.user.setProfile(userId, {
            name,
            avatar: avatarInputRef.current?.files?.[0]?.path ?? config.profile.avatar
        });
        setConfig(deepmerge<UserConfig>(config, { profile }));

        setName(profile.name);
        setAvatar(profile.avatar ? `${APPLICATION_PROTOCOL}://${APPLICATION_RESOURCE_AVATAR}/${nanoid()}` : null);
    };

    const handleCancelClick = () => {
        setEditing(false);

        setName(config.profile.name);
        setAvatar(config.profile.avatar ? `${APPLICATION_PROTOCOL}://${APPLICATION_RESOURCE_AVATAR}/${nanoid()}` : null);
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
                        <Box>
                            <input
                                ref={avatarInputRef}
                                onChange={handleInputFileChange}
                                type="file"
                                accept="image/*"
                                disabled={!editing}
                                hidden
                            />
                            <ButtonBase
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={!editing}
                                sx={{ borderRadius: '50%' }}
                            >
                                <Avatar
                                    src={avatar ?? undefined}
                                    sx={{ width: 64, height: 64, userSelect: 'none', pointerEvents: 'none' }}
                                />
                            </ButtonBase>
                        </Box>
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
                                <Typography variant="h5" sx={{ fontWeight: 300, userSelect: 'none' }}>
                                    {config.profile.name}
                                </Typography>
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
            <Section>
                <SectionContent>
                    <LinkItem
                        primary={translateSection.accountAndSync.title}
                        href="./account"
                        route
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>ほかのユーザー</SectionTitle>
                <SectionContent>
                    {users.filter((user) => user.id !== userId).map((user) => (
                        <LinkItem
                            key={user.id}
                            icon={
                                <Avatar
                                    src={user.avatar ?? undefined}
                                    sx={{ width: 32, height: 32 }}
                                />
                            }
                            primary={user.name}
                            href="#"
                        />
                    ))}
                </SectionContent>
            </Section>
        </Fragment>
    );
};
