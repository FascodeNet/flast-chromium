import { DescriptionOutlined, PaletteOutlined } from '@mui/icons-material';
import { Theme } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { GlobalNavigationDrawer } from '../../../../components/GlobalNavigationDrawer';
import { NavigationDrawer } from '../../../../components/NavigationDrawer';
import { StyledButton } from '../../../../components/NavigationDrawer/styles';
import { TranslateProvider, useTranslateContext } from '../../../../contexts/translate';
import { GlobalStyles, MuiLightGlobalStyles } from '../../../../themes';
import { Appearance } from '../Appearance';
import { Pages } from '../Pages';
import { StyledApp, StyledAppContent } from './styles';

const Content = () => {
    const [section, setSection] = useState<'appearance' | 'pages'>('appearance');

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings;

    return (
        <StyledApp>
            <Helmet title={translateSection.title} />
            <GlobalNavigationDrawer />
            <NavigationDrawer title={translateSection.title}>
                <StyledButton
                    startIcon={<PaletteOutlined color={section === 'appearance' ? 'primary' : 'action'} />}
                    color={section === 'appearance' ? 'primary' : 'inherit'}
                    onClick={() => setSection('appearance')}>
                    {translateSection.appearance.title}
                </StyledButton>
                <StyledButton
                    startIcon={<DescriptionOutlined color={section === 'pages' ? 'primary' : 'action'} />}
                    color={section === 'pages' ? 'primary' : 'inherit'}
                    onClick={() => setSection('pages')}>
                    起動時、ホーム、新しいタブ
                </StyledButton>
            </NavigationDrawer>
            <StyledAppContent>
                {section === 'appearance' && <Appearance />}
                {section === 'pages' && <Pages />}
            </StyledAppContent>
        </StyledApp>
    );
};

export const App = () => {
    const [theme, setTheme] = useState<Theme>(MuiLightGlobalStyles);

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
