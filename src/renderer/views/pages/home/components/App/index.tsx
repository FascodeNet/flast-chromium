import { Theme } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { DefaultUserConfig, UserConfig } from '../../../../../../interfaces/user';
import { TranslateProvider } from '../../../../../contexts/translate';
import { GlobalStyles, MuiDarkGlobalStyles, MuiLightGlobalStyles } from '../../../../../themes';
import { PageContent } from '../PageContent';

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
                    <PageContent />
                </TranslateProvider>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
