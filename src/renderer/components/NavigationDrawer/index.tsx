import React, { ReactNode } from 'react';
import { StyledDrawer, StyledTitle } from './styles';

interface Props {
    title: ReactNode;
    children?: ReactNode;
}

export const NavigationDrawer = ({ title, children }: Props) => {
    return (
        <StyledDrawer>
            <StyledTitle>{title}</StyledTitle>
            {children}
        </StyledDrawer>
    );
};
