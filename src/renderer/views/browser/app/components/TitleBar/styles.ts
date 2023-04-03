import { styled } from '@mui/material';

export const StyledContainer = styled('div')<{
    visible: boolean;
}>(({ theme, visible }) => ({
    width: '100%',
    height: 25,
    gridRow: 1,
    gridColumn: '1 / 4',
    display: visible ? 'flex' : 'none',
    appRegion: 'drag'
}));
