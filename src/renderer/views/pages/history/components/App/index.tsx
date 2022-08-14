import { Theme } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { DefaultUserConfig, UserConfig } from '../../../../../../interfaces/user';
import { GlobalNavigationDrawer } from '../../../../../components/GlobalNavigationDrawer';
import { Applications } from '../../../../../components/Icons';
import { Items } from '../../../../../components/Icons/object';
import { NavigationDrawer } from '../../../../../components/NavigationDrawer';
import { StyledButton } from '../../../../../components/NavigationDrawer/styles';
import { Page, PageContainer, PageContent } from '../../../../../components/Page';
import { TranslateProvider, useTranslateContext } from '../../../../../contexts/translate';
import { GlobalStyles, MuiDarkGlobalStyles, MuiLightGlobalStyles } from '../../../../../themes';
import { HistoryProvider } from '../../contexts/history';
import { All } from '../All';
import { LastWeek } from '../LastWeek';
import { Today } from '../Today';
import { Yesterday } from '../Yesterday';

interface ContentProps {
    section: 'all' | 'today' | 'yesterday' | 'lastWeek' | 'before';
}

const Content = ({ section }: ContentProps) => {
    const navigate = useNavigate();

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.history;

    return (
        <Page>
            <Helmet title={translateSection.title} />
            <GlobalNavigationDrawer />
            <NavigationDrawer title={translateSection.title}>
                <StyledButton
                    onClick={() => navigate('/all')}
                    active={section === 'all'}
                    startIcon={<Items />}
                >
                    {translateSection.all}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/today')}
                    active={section === 'today'}
                    startIcon={<Applications />}
                >
                    {translateSection.today}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/yesterday')}
                    active={section === 'yesterday'}
                    startIcon={<Applications />}
                >
                    {translateSection.yesterday}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/last-week')}
                    active={section === 'lastWeek'}
                    startIcon={<Applications />}
                >
                    {translateSection.lastWeek}
                </StyledButton>
                <StyledButton
                    onClick={() => navigate('/before')}
                    active={section === 'before'}
                    startIcon={<Applications />}
                >
                    {translateSection.before}
                </StyledButton>
            </NavigationDrawer>
            <PageContainer>
                <PageContent>
                    {section === 'all' && <All />}
                    {section === 'today' && <Today />}
                    {section === 'yesterday' && <Yesterday />}
                    {section === 'lastWeek' && <LastWeek />}
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
                    <HistoryProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route index element={<Navigate to="/all" replace />} />
                                <Route path="all" element={<Content section="all" />} />
                                <Route path="today" element={<Content section="today" />} />
                                <Route path="yesterday" element={<Content section="yesterday" />} />
                                <Route path="last-week" element={<Content section="lastWeek" />} />
                                <Route path="before" element={<Content section="before" />} />
                            </Routes>
                        </BrowserRouter>
                    </HistoryProvider>
                </TranslateProvider>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
