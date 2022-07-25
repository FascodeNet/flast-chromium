import { DescriptionOutlined, PaletteOutlined } from '@mui/icons-material';
import { Theme } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { DefaultUserConfig, UserConfig } from '../../../../../interfaces/user';
import { GlobalNavigationDrawer } from '../../../../components/GlobalNavigationDrawer';
import { NavigationDrawer } from '../../../../components/NavigationDrawer';
import { StyledButton } from '../../../../components/NavigationDrawer/styles';
import { Page, PageContainer, PageContent } from '../../../../components/Page';
import { TranslateProvider, useTranslateContext } from '../../../../contexts/translate';
import { GlobalStyles, MuiDarkGlobalStyles, MuiLightGlobalStyles } from '../../../../themes';
import { Appearance } from '../Appearance';
import { Pages } from '../Pages';

const Content = () => {
    const [section, setSection] = useState<'appearance' | 'pages'>('appearance');

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings;

    return (
        <Page>
            <Helmet title={translateSection.title} />
            <GlobalNavigationDrawer />
            <NavigationDrawer title={translateSection.title}>
                <StyledButton
                    onClick={() => setSection('appearance')}
                    active={section === 'appearance'}
                    startIcon={<PaletteOutlined color={section === 'appearance' ? 'primary' : 'action'} />}
                >
                    {translateSection.appearance.title}
                </StyledButton>
                <StyledButton
                    onClick={() => setSection('pages')}
                    active={section === 'pages'}
                    startIcon={<DescriptionOutlined color={section === 'pages' ? 'primary' : 'action'} />}
                >
                    起動時、ホーム、新しいタブ
                </StyledButton>
            </NavigationDrawer>
            <PageContainer>
                <PageContent>
                    {section === 'appearance' && <Appearance />}
                    {section === 'pages' && <Pages />}
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
                    <Content />
                </TranslateProvider>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
