import React, { Fragment } from 'react';
import { UserConfigProvider } from '../../../../../contexts/config';
import { GlobalStyles } from '../../../../../themes';
import { Panel } from '../Panel';
import { Popup } from '../Popup';

export const App = () => {
    return (
        <Fragment>
            <GlobalStyles />
            <UserConfigProvider>
                <Popup>
                    <Panel />
                </Popup>
            </UserConfigProvider>
        </Fragment>
    );
};
