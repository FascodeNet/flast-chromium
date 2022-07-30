import React, { Fragment } from 'react';
import { HistoryPanel } from '../../../../../components/HistoryPanel';
import { Popup } from '../../../../../components/Popup';
import { UserConfigProvider } from '../../../../../contexts/config';
import { GlobalStyles } from '../../../../../themes';

export const App = () => {
    return (
        <Fragment>
            <GlobalStyles />
            <UserConfigProvider>
                <Popup>
                    <HistoryPanel type="popup" />
                </Popup>
            </UserConfigProvider>
        </Fragment>
    );
};
