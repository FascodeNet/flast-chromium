import React, { Fragment } from 'react';
import { BookmarksPanel } from '../../../../../components/BookmarksPanel';
import { Popup, PopupContainer } from '../../../../../components/Popup';
import { UserConfigProvider } from '../../../../../contexts/config';
import { ThemeProvider } from '../../../../../contexts/theme';
import { GlobalStyles } from '../../../../../themes';

export const App = () => (
    <Fragment>
        <GlobalStyles />
        <UserConfigProvider>
            <ThemeProvider>
                <PopupContainer>
                    <Popup fullHeight>
                        <BookmarksPanel type="popup" />
                    </Popup>
                </PopupContainer>
            </ThemeProvider>
        </UserConfigProvider>
    </Fragment>
);
