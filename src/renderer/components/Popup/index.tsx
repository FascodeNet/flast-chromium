import React, { Fragment, ReactNode } from 'react';
import { useTheme } from '../../utils/theme';
import { StyledPopup } from './styles';

interface PopupProps {
    children: ReactNode;
}

export const Popup = ({ children }: PopupProps) => {
    const { mode: { path: modePath }, theme: { value: theme, path: themePath } } = useTheme();

    return (
        <Fragment>
            <link rel="stylesheet" type="text/css" href={modePath} />
            {theme && <link rel="stylesheet" type="text/css" href={themePath} />}
            <StyledPopup className="popup">{children}</StyledPopup>
        </Fragment>
    );
};
