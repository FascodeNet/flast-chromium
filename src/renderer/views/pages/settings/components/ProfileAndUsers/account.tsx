import { LoginOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, Divider, IconButton, Link, TextField, Typography } from '@mui/material';
import React, { Fragment, MouseEvent, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { APPLICATION_NAME } from '../../../../../../constants';
import { OFFICIAL_SERVER_ORIGIN } from '../../../../../../constants/server';
import { DefaultUserConfig, UserConfig } from '../../../../../../interfaces/user';
import { DeepPartial } from '../../../../../../utils';
import { Add, Applications, ArrowLeft, Bookmarks, Extension, History, Remove } from '../../../../../components/Icons';
import {
    ItemContainer,
    ItemFormContainer,
    ItemTextBlock,
    PageTitle,
    Section,
    SectionContent,
    SectionTitle,
    SwitchItem
} from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';

export const Account = () => {
    const navigate = useNavigate();

    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.profileAndUsers.accountAndSync;

    const [open, setOpen] = useState(false);
    const [type, setType] = useState<'official' | 'custom'>('official');
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [server, setServer] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        window.flast.user.current().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.flast.user.getConfig(id);
            setConfig(userConfig);
        });
    }, []);

    const setUserConfig = async (userConfig: DeepPartial<UserConfig>) => {
        setConfig(await window.flast.user.setConfig(userId, userConfig));
    };

    const setTypeAndMode = (serverType: 'official' | 'custom', actionMode: 'login' | 'register' = 'login') => {
        setType(serverType);
        setMode(actionMode);
    };

    const handleCancelClick = (e: MouseEvent<HTMLButtonElement>) => {
        setOpen(false);
        setTypeAndMode('official');
        setServer('');
        setEmail('');
        setPassword('');
    };

    const handleLoginClick = async (e: MouseEvent<HTMLButtonElement>) => {
        try {
            const res = await fetch(
                `${type === 'official' ? OFFICIAL_SERVER_ORIGIN : server}/user`,
                {
                    method: mode === 'login' ? 'POST' : 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                }
            );
            const data = await res.json();
            console.log(data);
            await setUserConfig(
                {
                    account: {
                        server: type === 'custom' ? server : null,
                        email: data.email,
                        token: data.token
                    }
                }
            );
        } catch {

        }
    };

    return (
        <Fragment>
            <Helmet title={`${translateSection.title} - ${translate.pages.settings.title}`} />
            <PageTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => navigate('/profiles')}>
                    <ArrowLeft />
                </IconButton>
                <div>{translateSection.title}</div>
            </PageTitle>
            <Section>
                <SectionTitle>アカウント</SectionTitle>
                <SectionContent>
                    {config.account?.token ? (
                        <Fragment>

                        </Fragment>
                    ) : (
                        <ItemContainer>
                            <ItemTextBlock
                                primary="アカウントにログインする"
                                secondary="または、アカウントを新規作成する"
                            />
                            <ItemFormContainer>
                                <Button variant="contained" sx={{ whiteSpace: 'nowrap' }} onClick={() => setOpen(true)}>
                                    {translateSection.login}
                                </Button>
                            </ItemFormContainer>
                        </ItemContainer>
                    )}
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>同期する内容の管理</SectionTitle>
                <SectionContent>
                    <SwitchItem
                        icon={<Bookmarks />}
                        primary={translate.pages.bookmarks.title}
                        checked={false}
                        setChecked={() => {
                        }}
                    />
                    <SwitchItem
                        icon={<History />}
                        primary={translate.pages.history.title}
                        checked={false}
                        setChecked={() => {
                        }}
                    />
                    <SwitchItem
                        icon={<Applications />}
                        primary={translate.pages.applications.title}
                        checked={false}
                        setChecked={() => {
                        }}
                    />
                    <SwitchItem
                        icon={<Extension />}
                        primary={translate.pages.extensions.title}
                        checked={false}
                        setChecked={() => {
                        }}
                    />
                </SectionContent>
            </Section>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                disableEscapeKeyDown
                maxWidth="xs"
                fullWidth
            >
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h5">
                        {mode === 'login' ? translateSection.login : '新規登録'}
                    </Typography>
                    {type === 'official' ? (mode === 'login' ? <Fragment>
                        <Typography>
                            {APPLICATION_NAME} が運営する公式サーバーにログインします<br />
                            <Link
                                href="#"
                                underline="hover"
                                onClick={() => setTypeAndMode('custom')}
                            >
                                勤務先や学校が運営するサーバーにログインする
                            </Link>
                        </Typography>
                        <Box sx={{ my: .5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <TextField
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                type="email"
                                required
                                label="メールアドレス"
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                type="password"
                                required
                                label="パスワード"
                                fullWidth
                                variant="outlined"
                            />
                            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                <Button onClick={handleCancelClick} startIcon={<Remove />}>
                                    {translate.common.cancel}
                                </Button>
                                <Button
                                    onClick={handleLoginClick}
                                    startIcon={<LoginOutlined />}
                                    variant="contained"
                                    sx={{ ml: 'auto' }}
                                >
                                    {translateSection.login}
                                </Button>
                            </Box>
                        </Box>
                        <Divider />
                        <Typography>
                            または、アカウントを
                            <Link
                                href="#"
                                underline="hover"
                                onClick={() => setTypeAndMode('official', 'register')}
                            >
                                新規作成
                            </Link>
                            する
                        </Typography>
                    </Fragment> : <Fragment>
                        <Typography>
                            {APPLICATION_NAME} が運営する公式サーバーに新規登録します
                        </Typography>
                        <Box sx={{ my: .5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <TextField
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                                type="text"
                                required
                                label="ユーザー名"
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                type="email"
                                required
                                label="メールアドレス"
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                type="password"
                                required
                                label="パスワード"
                                fullWidth
                                variant="outlined"
                            />
                            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                <Button onClick={handleCancelClick} startIcon={<Remove />}>
                                    {translate.common.cancel}
                                </Button>
                                <Button startIcon={<Add />} variant="contained" sx={{ ml: 'auto' }}>
                                    新規登録
                                </Button>
                            </Box>
                        </Box>
                        <Divider />
                        <Typography>
                            または、アカウントに
                            <Link
                                href="#"
                                underline="hover"
                                onClick={() => setTypeAndMode('official')}
                            >
                                ログイン
                            </Link>
                            する
                        </Typography>
                    </Fragment>) : <Fragment>
                        <Typography>
                            勤務先や学校が運営するサーバーにログインします<br />
                            <Link
                                href="#"
                                underline="hover"
                                onClick={() => setTypeAndMode('official')}
                            >
                                {APPLICATION_NAME} が運営する公式サーバーにログインする
                            </Link>
                        </Typography>
                        <Box sx={{ my: .5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <TextField
                                value={server}
                                onChange={(e) => setServer(e.currentTarget.value)}
                                type="text"
                                required
                                label="サーバー オリジン"
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                type="email"
                                required
                                label="メールアドレス"
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                type="password"
                                required
                                label="パスワード"
                                fullWidth
                                variant="outlined"
                            />
                            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                <Button onClick={handleCancelClick} startIcon={<Remove />}>
                                    {translate.common.cancel}
                                </Button>
                                <Button
                                    onClick={handleLoginClick}
                                    startIcon={<LoginOutlined />}
                                    variant="contained"
                                    sx={{ ml: 'auto' }}
                                >
                                    {translateSection.login}
                                </Button>
                            </Box>
                        </Box>
                    </Fragment>}
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};
