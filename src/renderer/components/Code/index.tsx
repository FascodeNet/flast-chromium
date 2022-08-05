import { styled } from '@mui/material';

export const Code = styled('code')(({ theme }) => ({
    margin: '0 2px',
    padding: '2px 4px',
    background: theme.palette.mode === 'light' ? '#f8f8f8' : 'rgba(255, 255, 255, 0.12)',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    fontFamily: 'HackGen, Consolas, monospace',
    color: 'unset'
}));
