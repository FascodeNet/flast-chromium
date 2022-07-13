import React, { Fragment } from 'react';
import { BookmarksPanel } from '../../../../../components/BookmarksPanel';
import { Popup } from '../../../../../components/Popup';
import { UserConfigProvider } from '../../../../../contexts/config';
import { GlobalStyles } from '../../../../../themes';

export const App = () => {
    return (
        <Fragment>
            <GlobalStyles />
            <UserConfigProvider>
                <Popup>
                    <BookmarksPanel type="popup" />
                </Popup>
            </UserConfigProvider>
        </Fragment>
    );
};
