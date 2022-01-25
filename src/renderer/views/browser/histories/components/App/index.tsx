import React, { Fragment } from 'react';
import { HistoriesPanel } from '../../../../../components/HistoriesPanel';
import { Popup } from '../../../../../components/Popup';
import { UserConfigProvider } from '../../../../../contexts/config';
import { GlobalStyles } from '../../../../../themes';

export const App = () => {
    return (
        <Fragment>
            <GlobalStyles />
            <UserConfigProvider>
                <Popup>
                    <HistoriesPanel type="popup" />
                </Popup>
            </UserConfigProvider>
        </Fragment>
    );
};
