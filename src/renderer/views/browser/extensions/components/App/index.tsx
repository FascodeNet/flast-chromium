import React, { Fragment } from 'react';
import { ExtensionsPanel } from '../../../../../components/ExtensionsPanel';
import { Popup, PopupContainer } from '../../../../../components/Popup';
import { UserConfigProvider } from '../../../../../contexts/config';
import { ThemeProvider } from '../../../../../contexts/theme';
import { ViewManagerProvider } from '../../../../../contexts/view';
import { GlobalStyles } from '../../../../../themes';

export const App = () => (
    <Fragment>
        <GlobalStyles />
        <UserConfigProvider>
            <ThemeProvider>
                <ViewManagerProvider>
                    <PopupContainer>
                        <Popup fullHeight>
                            <ExtensionsPanel type="popup" />
                        </Popup>
                    </PopupContainer>
                </ViewManagerProvider>
            </ThemeProvider>
        </UserConfigProvider>
    </Fragment>
);
