import React, { Fragment } from 'react';
import { Popup, PopupContainer } from '../../../../../components/Popup';
import { UserConfigProvider } from '../../../../../contexts/config';
import { ThemeProvider } from '../../../../../contexts/theme';
import { GlobalStyles } from '../../../../../themes';
import { Panel } from '../Panel';

export const App = () => (
    <Fragment>
        <GlobalStyles />
        <UserConfigProvider>
            <ThemeProvider>
                <PopupContainer>
                    <Popup>
                        <Panel />
                    </Popup>
                </PopupContainer>
            </ThemeProvider>
        </UserConfigProvider>
    </Fragment>
);
