import React, { Fragment } from 'react';
import { DownloadsPanel } from '../../../../../components/DownloadsPanel';
import { Popup } from '../../../../../components/Popup';
import { UserConfigProvider } from '../../../../../contexts/config';
import { GlobalStyles } from '../../../../../themes';

export const App = () => {
    return (
        <Fragment>
            <GlobalStyles />
            <UserConfigProvider>
                <Popup>
                    <DownloadsPanel type="popup" />
                </Popup>
            </UserConfigProvider>
        </Fragment>
    );
};
