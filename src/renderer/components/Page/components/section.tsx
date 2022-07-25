import { styled, Typography, TypographyProps } from '@mui/material';
import React from 'react';

export const Section = styled('section')(({ theme }) => ({
    padding: theme.spacing(1, 0),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(.5)
}));

export const SectionContent = styled('div')({
    display: 'flex',
    flexDirection: 'column'
});

export const SectionTitle = styled(
    (props: TypographyProps) => <Typography variant="h5" {...props} />
)<TypographyProps>(({ theme }) => ({
    fontWeight: 100
}));
