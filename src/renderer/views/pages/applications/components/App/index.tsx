import { Theme } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { DefaultUserConfig, UserConfig } from '../../../../../../interfaces/user';
import { GlobalNavigationDrawer } from '../../../../../components/GlobalNavigationDrawer';
import { NavigationDrawer } from '../../../../../components/NavigationDrawer';
import { Page, PageContainer, PageContent } from '../../../../../components/Page';
import { TranslateProvider, useTranslateContext } from '../../../../../contexts/translate';
import { GlobalStyles, MuiDarkGlobalStyles, MuiLightGlobalStyles } from '../../../../../themes';

const Content = () => {
    const { translate } = useTranslateContext();
    const translateSection = translate.pages.applications;

    return (
        <Page>
            <Helmet title={translateSection.title} />
            <GlobalNavigationDrawer />
            <NavigationDrawer title={translateSection.title}>
            </NavigationDrawer>
            <PageContainer>
                <PageContent>

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
                    <Content />
                </TranslateProvider>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
