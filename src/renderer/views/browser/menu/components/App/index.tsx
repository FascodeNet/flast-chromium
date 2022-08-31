import React, { Fragment } from 'react';
import { PopupContainer } from '../../../../../components/Popup';
import { UserConfigProvider } from '../../../../../contexts/config';
import { ThemeProvider } from '../../../../../contexts/theme';
import { GlobalStyles } from '../../../../../themes';
import { MainMenu } from '../Menu';

export const App = () => (
    <Fragment>
        <GlobalStyles />
        <UserConfigProvider>
            <ThemeProvider>
                <PopupContainer
                    sx={{
                        flexDirection: 'row-reverse',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        position: 'relative'
                    }}
                >
                    <MainMenu />
                </PopupContainer>
            </ThemeProvider>
        </UserConfigProvider>
    </Fragment>
);
