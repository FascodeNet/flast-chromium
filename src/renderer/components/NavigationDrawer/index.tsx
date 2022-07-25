import { Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import { StyledDrawer } from './styles';

interface Props {
    title: ReactNode;
    children?: ReactNode;
}

export const NavigationDrawer = ({ title, children }: Props) => (
    <StyledDrawer>
        <Typography variant="h4" sx={{ width: '100%', mb: 1, fontWeight: 100 }}>{title}</Typography>
        {children}
    </StyledDrawer>
);
