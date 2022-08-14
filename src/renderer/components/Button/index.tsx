import { Box, ButtonBase as MuiButtonBase, ButtonBaseProps, buttonClasses, styled, Theme } from '@mui/material';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

const buttonStyled = (theme: Theme) => ({
    margin: 0,
    padding: 0,
    display: 'flex',
    borderRadius: theme.shape.borderRadius,
    cursor: 'default',
    WebkitAppRegion: 'no-drag',
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.short
    }),
    [`&:hover, &.${buttonClasses.focusVisible}`]: {
        background: theme.palette.action.hover
    },
    [`&.${buttonClasses.focusVisible}`]: {
        outline: `solid 2px ${theme.palette.primary.main}`
    },
    [`&.${buttonClasses.disabled}`]: {
        color: theme.palette.action.disabled
    }
});

export const ButtonBase = styled(MuiButtonBase)(({ theme }) => ({
    ...buttonStyled(theme),
    padding: theme.spacing(.5),
    placeItems: 'center',
    placeContent: 'center',
    gap: theme.spacing(.75)
}));

export const ButtonIcon = styled(
    Box,
    { shouldForwardProp: (prop) => prop !== 'src' && prop !== 'size' }
)<{ src?: string; size?: string | number; }>(({ src, size }) => ({
    width: size ?? 24,
    minWidth: size ?? 24,
    height: size ?? 24,
    minHeight: size ?? 24,
    backgroundImage: src ? `url('${src}')` : 'unset',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain'
}));

export const IconButton = styled(
    ({ className, ...props }: ButtonBaseProps) => <MuiButtonBase className={clsx('IconButton', className)} {...props} />
)<ButtonBaseProps>(({ theme }) => ({
    ...buttonStyled(theme),
    placeItems: 'center',
    placeContent: 'center'
}));

interface ButtonProps extends ButtonBaseProps {
    icon?: ReactNode;
    children?: ReactNode;
}

export const Button = ({ icon, children, sx, ...props }: ButtonProps) => (
    <ButtonBase {...props} sx={{ ...sx, pr: children ? 1 : .5 }}>
        {icon && <Box
            className="Icon"
            sx={{
                display: 'flex',
                placeItems: 'center',
                placeContent: 'center',
                flexShrink: 0
            }}
        >
            {icon}
        </Box>}
        {children}
    </ButtonBase>
);
