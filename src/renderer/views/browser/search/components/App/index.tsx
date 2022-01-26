import React, { Fragment } from 'react';
import { UserConfigProvider } from '../../../../../contexts/config';
import { ViewManagerProvider } from '../../../../../contexts/view';
import { GlobalStyles } from '../../../../../themes';
import { Container } from '../Container';
import { Popup } from '../Popup';

export const App = () => {
    return (
        <Fragment>
            <GlobalStyles />
            <UserConfigProvider>
                <ViewManagerProvider>
                    <Container>
                        <Popup />
                    </Container>
                </ViewManagerProvider>
            </UserConfigProvider>
        </Fragment>
    );
};
