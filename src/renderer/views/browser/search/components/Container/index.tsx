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

    const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
        if (!(e.target as EventTarget & HTMLDivElement).classList.contains('dialog-container')) return;
        await destroyDialog();
    };

    return (
        <Fragment>
            <Helmet>
                <link rel="stylesheet" type="text/css" href={modePath} />
                {theme && <link rel="stylesheet" type="text/css" href={themePath} />}
            </Helmet>
            <StyledContainer className="dialog-container" onClick={handleClick}>
                {children}
            </StyledContainer>
        </Fragment>
    );
};
