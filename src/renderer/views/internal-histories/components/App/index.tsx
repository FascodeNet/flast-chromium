import React, { Fragment } from 'react';
import { HistoriesPanel } from '../../../../components/HistoriesPanel';
import { UserConfigProvider } from '../../../../contexts/config';
import { GlobalStyles } from '../../../../themes';
import { useTheme } from '../../../../utils/theme';
import { StyledApp } from './styles';

const Content = () => {
    const { mode: { path: modePath }, theme: { value: theme, path: themePath } } = useTheme();

    return (
        <Fragment>
            <link rel="stylesheet" type="text/css" href={modePath} />
            {theme && <link rel="stylesheet" type="text/css" href={themePath} />}
            <StyledApp className="popup">
                <HistoriesPanel type="popup" />
            </StyledApp>
        </Fragment>
    );
};

export const App = () => {
    return (
        <Fragment>
            <GlobalStyles />
            <UserConfigProvider>
                <Content />
            </UserConfigProvider>
        </Fragment>
    );
};
