import React, { Fragment } from 'react';
import { ExtensionsPanel } from '../../../../components/ExtensionsPanel';
import { Popup } from '../../../../components/Popup';
import { UserConfigProvider } from '../../../../contexts/config';
import { GlobalStyles } from '../../../../themes';

export const App = () => {
    return (
        <Fragment>
            <GlobalStyles />
            <UserConfigProvider>
                <Popup>
                    <ExtensionsPanel type="popup" />
                </Popup>
            </UserConfigProvider>
        </Fragment>
    );
};
