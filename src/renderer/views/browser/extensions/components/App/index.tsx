import React, { Fragment } from 'react';
import { ExtensionsPanel } from '../../../../../components/ExtensionsPanel';
import { Popup } from '../../../../../components/Popup';
import { UserConfigProvider } from '../../../../../contexts/config';
import { ViewManagerProvider } from '../../../../../contexts/view';
import { GlobalStyles } from '../../../../../themes';

export const App = () => {
    return (
        <Fragment>
            <GlobalStyles />
            <UserConfigProvider>
                <ViewManagerProvider>
                    <Popup>
                        <ExtensionsPanel type="popup" />
                    </Popup>
                </ViewManagerProvider>
            </UserConfigProvider>
        </Fragment>
    );
};
