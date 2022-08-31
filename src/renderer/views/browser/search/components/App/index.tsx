import React, { Fragment } from 'react';
import { UserConfigProvider } from '../../../../../contexts/config';
import { ThemeProvider } from '../../../../../contexts/theme';
import { ViewManagerProvider } from '../../../../../contexts/view';
import { GlobalStyles } from '../../../../../themes';
import { Container } from '../Container';
import { Popup } from '../Popup';

export const App = () => {
    return (
        <Fragment>
            <GlobalStyles />
            <UserConfigProvider>
                <ThemeProvider>
                    <ViewManagerProvider>
                        <Container>
                            <Popup />
                        </Container>
                    </ViewManagerProvider>
                </ThemeProvider>
            </UserConfigProvider>
        </Fragment>
    );
};
