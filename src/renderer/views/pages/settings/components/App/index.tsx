import {
    ComputerOutlined,
    DashboardOutlined,
    DescriptionOutlined,
    DownloadOutlined,
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
import { AdBlocker } from '../AdBlocker';
import { Appearance } from '../Appearance';
import { Download } from '../Download';
import { Pages } from '../Pages';
import { PrivacyAndSecurity } from '../PrivacyAndSecurity';
import { ProfileAndUsers } from '../ProfileAndUsers';
import { Account } from '../ProfileAndUsers/account';
import { Search } from '../Search';
import { Sites } from '../Sites';
import { SitePermission } from '../Sites/permission';
import { SystemAndPerformance } from '../SystemAndPerformance';

interface ContentProps {
    section: 'profileAndUsers'
        | 'account'
        | 'privacyAndSecurity'
        | 'adBlocker'
        | 'appearance'
        | 'pages'
        | 'searchAndAddressBar'
        | 'sites'
        | 'siteGeoLocation'
        | 'siteCamera'
        | 'siteMicrophone'
        | 'siteNotifications'
        | 'siteSensors'
        | 'siteMidi'
        | 'siteHid'
        | 'siteSerial'
        | 'siteIdleDetection'
        | 'siteClipboard'
        | 'sitePointerLock'
        | 'siteOpenExternal'
        | 'download'
        | 'systemAndPerformance';
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
                    active={section === 'profileAndUsers' || section === 'account'}
                    startIcon={<SupervisorAccountOutlined />}
                >
                    {translateSection.profileAndUsers.title}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/privacy-security')}
                    active={section === 'privacyAndSecurity'}
                    startIcon={<LockOutlined />}
                >
                    {translateSection.privacyAndSecurity.title}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/ad-blocker')}
                    active={section === 'adBlocker'}
                    startIcon={<ShieldOutlined />}
                >
                    {translateSection.adBlocker.title}
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
                    active={section === 'searchAndAddressBar'}
                    startIcon={<SearchOutlined />}
                >
                    {translateSection.searchAndAddressBar.title}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/sites')}
                    active={section.startsWith('site')}
                    startIcon={<DashboardOutlined />}
                >
                    {translateSection.sites.title}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/download')}
                    active={section === 'download'}
                    startIcon={<DownloadOutlined />}
                >
                    {translateSection.download.title}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/system')}
                    active={section === 'systemAndPerformance'}
                    startIcon={<ComputerOutlined />}
                >
                    {translateSection.systemAndPerformance.title}
                </StyledButton>
            </NavigationDrawer>
            <PageContainer>
                <PageContent>
                    {section === 'profileAndUsers' && <ProfileAndUsers />}
                    {section === 'account' && <Account />}
                    {section === 'privacyAndSecurity' && <PrivacyAndSecurity />}
                    {section === 'adBlocker' && <AdBlocker />}
                    {section === 'appearance' && <Appearance />}
                    {section === 'pages' && <Pages />}
                    {section === 'searchAndAddressBar' && <Search />}
                    {section === 'sites' && <Sites />}
                    {section === 'siteGeoLocation' && <SitePermission type="geolocation" />}
                    {section === 'siteCamera' && <SitePermission type="camera" />}
                    {section === 'siteMicrophone' && <SitePermission type="microphone" />}
                    {section === 'siteNotifications' && <SitePermission type="notifications" />}
                    {section === 'siteSensors' && <SitePermission type="sensors" />}
                    {section === 'siteMidi' && <SitePermission type="midi" />}
                    {section === 'siteHid' && <SitePermission type="hid" />}
                    {section === 'siteSerial' && <SitePermission type="serial" />}
                    {section === 'siteIdleDetection' && <SitePermission type="idle_detection" />}
                    {section === 'siteClipboard' && <SitePermission type="clipboard" />}
                    {section === 'sitePointerLock' && <SitePermission type="pointer_lock" />}
                    {section === 'siteOpenExternal' && <SitePermission type="open_external" />}
                    {section === 'download' && <Download />}
                    {section === 'systemAndPerformance' && <SystemAndPerformance />}
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
        window.flast.user.current().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.flast.user.getConfig(id);
            setConfig(userConfig);
            setTheme(userConfig.appearance.color_scheme === 'dark' ? MuiDarkGlobalStyles : MuiLightGlobalStyles);
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
                            <Route path="profiles">
                                <Route index element={<Content section="profileAndUsers" />} />
                                <Route path="account" element={<Content section="account" />} />
                            </Route>
                            <Route path="privacy-security" element={<Content section="privacyAndSecurity" />} />
                            <Route path="ad-blocker" element={<Content section="adBlocker" />} />
                            <Route path="appearance" element={<Content section="appearance" />} />
                            <Route path="pages" element={<Content section="pages" />} />
                            <Route path="search" element={<Content section="searchAndAddressBar" />} />
                            <Route path="sites">
                                <Route index element={<Content section="sites" />} />
                                <Route path="location" element={<Content section="siteGeoLocation" />} />
                                <Route path="camera" element={<Content section="siteCamera" />} />
                                <Route path="microphone" element={<Content section="siteMicrophone" />} />
                                <Route path="notifications" element={<Content section="siteNotifications" />} />
                                <Route path="sensors" element={<Content section="siteSensors" />} />
                                <Route path="midi" element={<Content section="siteMidi" />} />
                                <Route path="hid" element={<Content section="siteHid" />} />
                                <Route path="serial" element={<Content section="siteSerial" />} />
                                <Route path="idle-detection" element={<Content section="siteIdleDetection" />} />
                                <Route path="clipboard" element={<Content section="siteClipboard" />} />
                                <Route path="pointer-lock" element={<Content section="sitePointerLock" />} />
                                <Route path="open-external" element={<Content section="siteOpenExternal" />} />
                            </Route>
                            <Route path="download" element={<Content section="download" />} />
                            <Route path="system" element={<Content section="systemAndPerformance" />} />
                        </Routes>
                    </BrowserRouter>
                </TranslateProvider>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
