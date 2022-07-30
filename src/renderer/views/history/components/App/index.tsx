import { Theme } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { DefaultUserConfig, UserConfig } from '../../../../../interfaces/user';
import { GlobalNavigationDrawer } from '../../../../components/GlobalNavigationDrawer';
import { Applications } from '../../../../components/Icons';
import { Items } from '../../../../components/Icons/object';
import { NavigationDrawer } from '../../../../components/NavigationDrawer';
import { StyledButton } from '../../../../components/NavigationDrawer/styles';
import { Page, PageContainer, PageContent } from '../../../../components/Page';
import { TranslateProvider, useTranslateContext } from '../../../../contexts/translate';
import { GlobalStyles, MuiDarkGlobalStyles, MuiLightGlobalStyles } from '../../../../themes';
import { HistoryProvider } from '../../contexts/history';
import { All } from '../All';
import { LastWeek } from '../LastWeek';
import { Today } from '../Today';
import { Yesterday } from '../Yesterday';

const Content = () => {
    const [section, setSection] = useState<'all' | 'today' | 'yesterday' | 'lastWeek' | 'before'>('all');

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.history;

    return (
        <Page>
            <Helmet title={translateSection.title} />
            <GlobalNavigationDrawer />
            <NavigationDrawer title={translateSection.title}>
                <StyledButton
                    onClick={() => setSection('all')}
                    active={section === 'all'}
                    startIcon={<Items />}
                >
                    {translateSection.all}
                </StyledButton>
                <StyledButton
                    onClick={() => setSection('today')}
                    active={section === 'today'}
                    startIcon={<Applications />}
                >
                    {translateSection.today}
                </StyledButton>
                <StyledButton
                    onClick={() => setSection('yesterday')}
                    active={section === 'yesterday'}
                    startIcon={<Applications />}
                >
                    {translateSection.yesterday}
                </StyledButton>
                <StyledButton
                    onClick={() => setSection('lastWeek')}
                    active={section === 'lastWeek'}
                    startIcon={<Applications />}
                >
                    {translateSection.lastWeek}
                </StyledButton>
                <StyledButton
                    onClick={() => setSection('before')}
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
                    <HistoryProvider>
                        <Content />
                    </HistoryProvider>
                </TranslateProvider>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
