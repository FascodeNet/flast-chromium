import React, { Fragment, ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { useTheme } from '../../utils/theme';
import { StyledPopup } from './styles';

interface PopupProps {
    children: ReactNode;
}

export const Popup = ({ children }: PopupProps) => {
    const { mode: { path: modePath }, theme: { value: theme, path: themePath } } = useTheme();

    return (
        <Fragment>
            <Helmet>
                <link rel="stylesheet" type="text/css" href={modePath} />
                {theme && <link rel="stylesheet" type="text/css" href={themePath} />}
            </Helmet>
            <StyledPopup className="popup">{children}</StyledPopup>
        </Fragment>
    );
};
