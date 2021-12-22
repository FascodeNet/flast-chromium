import React, { Fragment } from 'react';
import { UserConfigProvider, useUserConfigContext } from '../../../../contexts/config';
import { GlobalStyles } from '../../../../themes';
import { SidebarHistories } from '../../../app/components/SidebarContent';
import { StyledApp } from './styles';

const Content = () => {
    const { config } = useUserConfigContext();

    return (
        <StyledApp>
            <SidebarHistories />
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
