import {
    Avatar as MuiAvatar,
    AvatarProps,
    Box,
    Divider as MuiDivider,
    DividerProps,
    styled,
    useTheme
} from '@mui/material';
import React from 'react';
import { borderRadius } from '../../../../../themes';

export const Panel = styled(Box)({
    width: '100%',
    height: '100%',
    gridArea: 'panel',
    gridTemplateRows: '1fr',
    gridTemplateAreas: 'content',
    borderRadius: borderRadius.toUnit(),
    overflow: 'hidden',
    userSelect: 'none'
});

export const PanelContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    padding: theme.spacing(1, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&::-webkit-scrollbar': {
        width: theme.spacing(1.5),
        height: theme.spacing(1.5)
    },
    '&::-webkit-scrollbar-track': {
        border: 'solid 2px transparent',
        borderRight: 'solid 3px transparent'
    },
    '&::-webkit-scrollbar-thumb': {
        boxShadow: 'inset 0 0 10px 10px #bbb',
        border: 'solid 2px transparent',
        borderRight: 'solid 3px transparent',
        borderRadius: 9
    },
    '&::-webkit-scrollbar-thumb:hover, ::-webkit-scrollbar-thumb:active': {
        boxShadow: 'inset 0 0 10px 10px #aaa'
    }
}));

export const PanelItem = styled(Box)(({ theme }) => ({
    width: '100%',
    height: 48,
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.short
    })
}));

export const Divider = (props: DividerProps) => (<MuiDivider flexItem sx={{ my: 1 }} {...props} />);

export const Avatar = ({ sx, ...props }: AvatarProps) => {
    const { palette: { background } } = useTheme();

    return (
        <MuiAvatar
            sx={{
                userSelect: 'none',
                pointerEvents: 'none',
                '& .MuiSvgIcon-root': {
                    color: background.default,
                    fill: background.default
                },
                ...sx
            }}
            {...props}
        />
    );
};
