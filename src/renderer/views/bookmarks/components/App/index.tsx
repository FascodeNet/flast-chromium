import { Theme } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { BookmarkData, DefaultUserConfig, UserConfig } from '../../../../../interfaces/user';
import { GlobalNavigationDrawer } from '../../../../components/GlobalNavigationDrawer';
import { Folder, Items } from '../../../../components/Icons/object';
import { NavigationDrawer } from '../../../../components/NavigationDrawer';
import { StyledButton } from '../../../../components/NavigationDrawer/styles';
import { Page, PageContainer, PageContent } from '../../../../components/Page';
import { TranslateProvider, useTranslateContext } from '../../../../contexts/translate';
import { GlobalStyles, MuiDarkGlobalStyles, MuiLightGlobalStyles } from '../../../../themes';
import { BookmarksProvider, useBookmarksContext } from '../../contexts/bookmarks';
import { FolderView } from '../FolderView';

const Content = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { bookmarks } = useBookmarksContext();

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.bookmarks;

    const folders = bookmarks.filter((bookmark) => bookmark.isFolder && bookmark.parent === id)
        .map((bookmark) => (bookmark) as Required<BookmarkData>)
        .sort((a, b) => a.title.localeCompare(b.title, 'ja'));

    return (
        <Page>
            <Helmet title={translateSection.title} />
            <GlobalNavigationDrawer />
            <NavigationDrawer title={translateSection.title}>
                <StyledButton onClick={() => navigate('/')} active={id === undefined} startIcon={<Items />}>
                    {translateSection.all}
                </StyledButton>
                {folders.map(({ _id, title }) => (
                    <StyledButton
                        key={_id}
                        onClick={() => navigate(`/${_id}`)}
                        active={id === _id}
                        startIcon={<Folder />}
                    >
                        {title}
                    </StyledButton>
                ))}
            </NavigationDrawer>
            <PageContainer>
                <PageContent>
                    <FolderView id={id} />
                </PageContent>
            </PageContainer>
        </Page>
    );
};

export const App = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const [theme, setTheme] = useState<Theme>(config.appearance.mode === 'dark' ? MuiDarkGlobalStyles : MuiLightGlobalStyles);

    useEffect(() => {
        window.api.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.api.getUserConfig(id);
            setConfig(userConfig);
            setTheme(userConfig.appearance.mode === 'dark' ? MuiDarkGlobalStyles : MuiLightGlobalStyles);
        });
    }, []);

    return (
        <MuiThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
                <GlobalStyles />
                <TranslateProvider>
                    <BookmarksProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route index element={<Content />} />
                                <Route path=":id" element={<Content />} />
                            </Routes>
                        </BrowserRouter>
                    </BookmarksProvider>
                </TranslateProvider>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
