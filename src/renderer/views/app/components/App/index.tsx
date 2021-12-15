import React, { Fragment } from 'react';
import { UserConfigProvider, useUserConfigContext } from '../../../../contexts/config';
import { ViewManagerProvider } from '../../../../contexts/view';
import { GlobalStyles } from '../../../../themes';
import { AppContent } from '../AppContent';
import { TitleBar } from '../TitleBar';
import { ToolBar } from '../ToolBar';
import { StyledApp } from './styles';

const Content = () => {
    const { config } = useUserConfigContext();

    return (
        <StyledApp className="app" appearanceStyle={config.appearance.style}>
            <TitleBar />
            {config.appearance.style === 'top_double' && <ToolBar />}
            <AppContent />
        </StyledApp>
    );
};

export const App = () => {
    return (
        <Fragment>
            <GlobalStyles />
            <UserConfigProvider>
                <ViewManagerProvider>
                    <Content />
                </ViewManagerProvider>
            </UserConfigProvider>
        </Fragment>
    );
};
