import React, { Fragment, MouseEvent, ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { useElectronAPI } from '../../../../../utils/electron';
import { useTheme } from '../../../../../utils/theme';
import { StyledContainer } from './styles';

interface Props {
    children: ReactNode;
}

export const Container = ({ children }: Props) => {
    const { destroyDialog } = useElectronAPI();

    const { mode: { path: modePath }, theme: { value: theme, path: themePath } } = useTheme();

    const handlePopupClick = async (e: MouseEvent<HTMLDivElement>) => {
        console.log(e.target, e.currentTarget);
        if (e.target !== e.currentTarget) return;
        await destroyDialog();
    };

    return (
        <Fragment>
            <Helmet>
                <link rel="stylesheet" type="text/css" href={modePath} />
                {theme && <link rel="stylesheet" type="text/css" href={themePath} />}
            </Helmet>
            <StyledContainer className="popup search" onClick={handlePopupClick}>
                {children}
            </StyledContainer>
        </Fragment>
    );
};
