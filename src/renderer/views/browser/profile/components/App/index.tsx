import React, { Fragment } from 'react';
import { Popup, PopupContainer } from '../../../../../components/Popup';
import { UserConfigProvider } from '../../../../../contexts/config';
import { ThemeProvider } from '../../../../../contexts/theme';
import { ViewManagerProvider } from '../../../../../contexts/view';
import { GlobalStyles } from '../../../../../themes';
import { Panel } from '../Panel';

export const App = () => (
    <Fragment>
        <GlobalStyles />
        <UserConfigProvider>
            <ThemeProvider>
                <ViewManagerProvider>
                    <PopupContainer>
                        <Popup>
                            <Panel />
                        </Popup>
                    </PopupContainer>
                </ViewManagerProvider>
            </ThemeProvider>
        </UserConfigProvider>
    </Fragment>
);
