import {
    ComputerOutlined,
    DescriptionOutlined,
    LockOutlined,
    PaletteOutlined,
    SearchOutlined,
    ShieldOutlined,
    SupervisorAccountOutlined
} from '@mui/icons-material';
import { Theme } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { DefaultUserConfig, UserConfig } from '../../../../../../interfaces/user';
import { GlobalNavigationDrawer } from '../../../../../components/GlobalNavigationDrawer';
import { NavigationDrawer } from '../../../../../components/NavigationDrawer';
import { StyledButton } from '../../../../../components/NavigationDrawer/styles';
import { Page, PageContainer, PageContent } from '../../../../../components/Page';
import { TranslateProvider, useTranslateContext } from '../../../../../contexts/translate';
import { GlobalStyles, MuiDarkGlobalStyles, MuiLightGlobalStyles } from '../../../../../themes';
import { Appearance } from '../Appearance';
import { Pages } from '../Pages';
import { PrivacyAndSecurity } from '../PrivacyAndSecurity';
import { ProfileAndUsers } from '../ProfileAndUsers';
import { Search } from '../Search';

interface ContentProps {
    section: 'profile_users' | 'privacy_security' | 'ad_blocker' | 'appearance' | 'pages' | 'search' | 'system';
}

const Content = ({ section }: ContentProps) => {
    const navigate = useNavigate();

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings;

    return (
        <Page>
            <Helmet title={translateSection.title} />
            <GlobalNavigationDrawer />
            <NavigationDrawer title={translateSection.title}>
                <StyledButton
                    onClick={() => navigate('/profiles')}
                    active={section === 'profile_users'}
                    startIcon={<SupervisorAccountOutlined />}
                >
                    {translateSection.profileAndUsers.title}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/privacy-security')}
                    active={section === 'privacy_security'}
                    startIcon={<LockOutlined />}
                >
                    {translateSection.privacyAndSecurity.title}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/ad-blocker')}
                    active={section === 'ad_blocker'}
                    startIcon={<ShieldOutlined />}
                >
                    広告ブロック
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/appearance')}
                    active={section === 'appearance'}
                    startIcon={<PaletteOutlined />}
                >
                    {translateSection.appearance.title}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/pages')}
                    active={section === 'pages'}
                    startIcon={<DescriptionOutlined />}
                >
                    {translateSection.pages.title}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/search')}
                    active={section === 'search'}
                    startIcon={<SearchOutlined />}
                >
                    {translateSection.search.title}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/system')}
                    active={section === 'system'}
                    startIcon={<ComputerOutlined />}
                >
                    システム
                </StyledButton>
            </NavigationDrawer>
            <PageContainer>
                <PageContent>
                    {section === 'profile_users' && <ProfileAndUsers />}
                    {section === 'privacy_security' && <PrivacyAndSecurity />}
                    {section === 'appearance' && <Appearance />}
                    {section === 'pages' && <Pages />}
                    {section === 'search' && <Search />}
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
        window.flast.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.flast.getUserConfig(id);
            setConfig(userConfig);
            setTheme(userConfig.appearance.mode === 'dark' ? MuiDarkGlobalStyles : MuiLightGlobalStyles);
        });
    }, []);

    return (
        <MuiThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
                <GlobalStyles />
                <TranslateProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route index element={<Navigate to="/profiles" replace />} />
                            <Route path="profiles" element={<Content section="profile_users" />} />
                            <Route path="privacy-security" element={<Content section="privacy_security" />} />
                            <Route path="ad-blocker" element={<Content section="ad_blocker" />} />
                            <Route path="appearance" element={<Content section="appearance" />} />
                            <Route path="pages" element={<Content section="pages" />} />
                            <Route path="search" element={<Content section="search" />} />
                            <Route path="system" element={<Content section="system" />} />
                        </Routes>
                    </BrowserRouter>
                </TranslateProvider>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
