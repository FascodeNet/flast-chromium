import React, { Fragment } from 'react';
import { HistoriesPanel } from '../../../../components/HistoriesPanel';
import { UserConfigProvider, useUserConfigContext } from '../../../../contexts/config';
import { GlobalStyles } from '../../../../themes';
import { StyledApp } from './styles';

const Content = () => {
    const { config: _ } = useUserConfigContext();

    return (
        <StyledApp>
            <HistoriesPanel type="popup" />
        </StyledApp>
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
