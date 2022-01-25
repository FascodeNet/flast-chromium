import React, { Fragment } from 'react';
import { Popup } from '../../../../../components/Popup';
import { UserConfigProvider } from '../../../../../contexts/config';
import { ViewManagerProvider } from '../../../../../contexts/view';
import { GlobalStyles } from '../../../../../themes';
import { Panel } from '../Panel';

export const App = () => {

    return (
        <Fragment>
            <GlobalStyles />
            <UserConfigProvider>
                <ViewManagerProvider>
                    <Popup>
                        <Panel />
                    </Popup>
                </ViewManagerProvider>
            </UserConfigProvider>
        </Fragment>
    );
};
