import { InputAdornment, TextField, Theme } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { isToday, isWithinInterval, isYesterday, previousSaturday, previousSunday, subWeeks } from 'date-fns';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { DefaultUserConfig, UserConfig } from '../../../../../../interfaces/user';
import { includes } from '../../../../../../utils';
import { GlobalNavigationDrawer } from '../../../../../components/GlobalNavigationDrawer';
import { Applications, Items, Search } from '../../../../../components/Icons';
import { NavigationDrawer } from '../../../../../components/NavigationDrawer';
import { StyledButton } from '../../../../../components/NavigationDrawer/styles';
import { Page, PageContainer, PageContent } from '../../../../../components/Page';
import { TranslateProvider, useTranslateContext } from '../../../../../contexts/translate';
import { GlobalStyles, MuiDarkGlobalStyles, MuiLightGlobalStyles } from '../../../../../themes';
import { HistoryProvider } from '../../contexts/history';
import { ListView } from '../ListView';

interface ContentProps {
    section: 'all' | 'today' | 'yesterday' | 'lastWeek' | 'before';
}

const Content = ({ section }: ContentProps) => {
    const navigate = useNavigate();

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.history;

    const today = new Date();
    const lastWeekStart = previousSunday(subWeeks(today, 1));
    const lastWeekEnd = previousSaturday(today);

    lastWeekStart.setHours(0, 0, 0, 0);
    lastWeekEnd.setHours(23, 59, 59, 999);

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
                    onClick={() => handleNavigate('/today')}
                    active={!isQuery && section === 'today'}
                    startIcon={<Applications />}
                >
                    {translateSection.today}
                </StyledButton>
                <StyledButton
                    onClick={() => handleNavigate('/yesterday')}
                    active={!isQuery && section === 'yesterday'}
                    startIcon={<Applications />}
                >
                    {translateSection.yesterday}
                </StyledButton>
                <StyledButton
                    onClick={() => handleNavigate('/last-week')}
                    active={!isQuery && section === 'lastWeek'}
                    startIcon={<Applications />}
                >
                    {translateSection.lastWeek}
                </StyledButton>
                <StyledButton
                    onClick={() => handleNavigate('/before')}
                    active={!isQuery && section === 'before'}
                    startIcon={<Applications />}
                >
                    {translateSection.before}
                </StyledButton>
            </NavigationDrawer>
            <PageContainer>
                <PageContent>
                    {isQuery ? <ListView
                        title={translateSection.search.title}
                        filter={({ title, url }) => includes(title, query, true) || includes(url, query, true)}
                    /> : <Fragment>
                        {section === 'all' && <ListView title={translateSection.all} />}
                        {section === 'today' && <ListView
                            title={translateSection.today}
                            filter={({ updatedAt }) => isToday(updatedAt)}
                        />}
                        {section === 'yesterday' && <ListView
                            title={translateSection.yesterday}
                            filter={({ updatedAt }) => isYesterday(updatedAt)}
                        />}
                        {section === 'lastWeek' && <ListView
                            title={translateSection.lastWeek}
                            filter={({ updatedAt }) => isWithinInterval(updatedAt, {
                                start: lastWeekStart,
                                end: lastWeekEnd
                            })}
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
