import { InputAdornment, TextField, Theme } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { DefaultUserConfig, UserConfig } from '../../../../../../interfaces/user';
import { includes } from '../../../../../../utils';
import { GlobalNavigationDrawer } from '../../../../../components/GlobalNavigationDrawer';
import { Audio, Image, Items, Search, Video } from '../../../../../components/Icons';
import { NavigationDrawer } from '../../../../../components/NavigationDrawer';
import { StyledButton } from '../../../../../components/NavigationDrawer/styles';
import { Page, PageContainer, PageContent } from '../../../../../components/Page';
import { TranslateProvider, useTranslateContext } from '../../../../../contexts/translate';
import { GlobalStyles, MuiDarkGlobalStyles, MuiLightGlobalStyles } from '../../../../../themes';
import { DownloadsProvider } from '../../contexts/downloads';
import { ListView } from '../ListView';

interface ContentProps {
    section: 'all' | 'images' | 'videos' | 'audios';
}

const Content = ({ section }: ContentProps) => {
    const navigate = useNavigate();

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.downloads;

    const [query, setQuery] = useState('');
    const isQuery = query.length > 0;

    const handleNavigate = (path: string) => {
        setQuery('');
        navigate(path);
    };

    return (
        <Page>
            <Helmet title={translateSection.title} />
            <GlobalNavigationDrawer />
            <NavigationDrawer title={translateSection.title}>
                <TextField
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={translateSection.search.placeholder}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        )
                    }}
                    fullWidth
                    size="small"
                    margin="none"
                    sx={{ mb: 1 }}
                />
                <StyledButton
                    onClick={() => handleNavigate('/all')}
                    active={!isQuery && section === 'all'}
                    startIcon={<Items />}
                >
                    {translateSection.all}
                </StyledButton>
                <StyledButton
                    onClick={() => handleNavigate('/images')}
                    active={!isQuery && section === 'images'}
                    startIcon={<Image />}
                >
                    {translateSection.images}
                </StyledButton>
                <StyledButton
                    onClick={() => handleNavigate('/videos')}
                    active={!isQuery && section === 'videos'}
                    startIcon={<Video />}
                >
                    {translateSection.videos}
                </StyledButton>
                <StyledButton
                    onClick={() => handleNavigate('/audios')}
                    active={!isQuery && section === 'audios'}
                    startIcon={<Audio />}
                >
                    {translateSection.audios}
                </StyledButton>
            </NavigationDrawer>
            <PageContainer>
                <PageContent>
                    {isQuery ? <ListView
                        title={translateSection.search.title}
                        filter={({ name, url }) => includes(name, query, true) || includes(url, query, true)}
                    /> : <Fragment>
                        {section === 'all' && <ListView title={translateSection.all} />}
                        {section === 'images' && <ListView
                            title={translateSection.images}
                            filter={({ mimeType }) => mimeType.startsWith('image/')}
                        />}
                        {section === 'videos' && <ListView
                            title={translateSection.videos}
                            filter={({ mimeType }) => mimeType.startsWith('video/')}
                        />}
                        {section === 'audios' && <ListView
                            title={translateSection.audios}
                            filter={({ mimeType }) => mimeType.startsWith('audio/')}
                        />}
                    </Fragment>}
                </PageContent>
            </PageContainer>
        </Page>
    );
};

export const App = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const [theme, setTheme] = useState<Theme>(config.appearance.color_scheme === 'dark' ? MuiDarkGlobalStyles : MuiLightGlobalStyles);

    useEffect(() => {
        window.flast.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.flast.getUserConfig(id);
            setConfig(userConfig);
            setTheme(userConfig.appearance.color_scheme === 'dark' ? MuiDarkGlobalStyles : MuiLightGlobalStyles);
        });
    }, []);

    return (
        <MuiThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
                <GlobalStyles />
                <TranslateProvider>
                    <DownloadsProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route index element={<Navigate to="/all" replace />} />
                                <Route path="all" element={<Content section="all" />} />
                                <Route path="images" element={<Content section="images" />} />
                                <Route path="videos" element={<Content section="videos" />} />
                                <Route path="audios" element={<Content section="audios" />} />
                            </Routes>
                        </BrowserRouter>
                    </DownloadsProvider>
                </TranslateProvider>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
