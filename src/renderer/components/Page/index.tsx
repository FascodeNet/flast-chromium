import { Box, styled, Typography, TypographyProps } from '@mui/material';
import React from 'react';

export const Page = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateAreas: '\'content\'',
    color: theme.palette.text.primary,
    background: theme.palette.background.default,
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '56px 300px 1fr',
        gridTemplateAreas: '\'global-navigation-drawer navigation-drawer content\''
    }
}));

export const PageContainer = styled('main')(({ theme }) => ({
    width: '100%',
    height: '100%',
    gridArea: 'content',
    overflow: 'hidden auto'
}));

export const PageContent = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: 'calc(820px + calc(2rem * 2))',
    minHeight: '100%',
    padding: '3rem 2rem'
}));

export const PageTitle = styled(
    (props: TypographyProps) => <Typography variant="h4" {...props} />
)<TypographyProps>(({ theme }) => ({
    fontWeight: 100
}));

export * from './components/section';
export * from './components/items';
