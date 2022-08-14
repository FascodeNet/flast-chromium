import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { MouseEvent, ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { parseTheme } from '../../../../../../utils/theme';
import { useElectronAPI, useNativeTheme } from '../../../../../utils/electron';
import { StyledContainer } from './styles';

interface Props {
    children: ReactNode;
}

export const Container = ({ children }: Props) => {
    const { dialogApi } = useElectronAPI();

    const { schemePath, themePath } = parseTheme();
    const nativeTheme = useNativeTheme();

    const handlePopupClick = async (e: MouseEvent<HTMLDivElement>) => {
        console.log(e.target, e.currentTarget);
        if (e.target !== e.currentTarget) return;
        await dialogApi.destroy();
    };

    return (
        <MuiThemeProvider theme={nativeTheme}>
            <StyledThemeProvider theme={nativeTheme}>
                <Helmet>
                    <link rel="stylesheet" type="text/css" href={schemePath} />
                    {themePath && <link rel="stylesheet" type="text/css" href={themePath} />}
                </Helmet>
                <StyledContainer className="popup search" onClick={handlePopupClick}>
                    {children}
                </StyledContainer>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};
