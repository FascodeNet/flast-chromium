import { styled, Theme } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import React, { MouseEvent, ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { parseTheme } from '../../../utils/theme';
import { borderRadius } from '../../themes';
import { useElectronAPI, useNativeTheme } from '../../utils/electron';

interface Props {
    children?: ReactNode;
    sx?: SxProps<Theme>;
}

export const MAX_HEIGHT = 'calc(100% - 30px)';

export const Container = styled('div')({
    width: '100%',
    height: '100%',
    margin: 0,
    padding: '0 15px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
});

export const PopupContainer = ({ children, sx }: Props) => {
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
                <Container sx={sx} onClick={handlePopupClick}>{children}</Container>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
};

export interface PopupBaseProps {
    fullHeight?: boolean;
}

export const PopupBase = styled(
    'div',
    { shouldForwardProp: (prop) => prop !== 'sx' && prop !== 'fullHeight' }
)<PopupBaseProps>(({ fullHeight }) => ({
    width: '100%',
    height: fullHeight ? '100%' : 'auto',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    placeContent: 'center',
    placeItems: 'center',
    boxShadow: '0 12px 16px rgba(0, 0, 0, .12), 0 8px 10px rgba(0, 0, 0, .16)',
    borderRadius: borderRadius.toUnit()
}));

export const Popup = ({ children, fullHeight, sx }: Props & PopupBaseProps) => (
    <PopupBase className="popup" fullHeight={fullHeight} sx={sx}>
        {children}
    </PopupBase>
);
