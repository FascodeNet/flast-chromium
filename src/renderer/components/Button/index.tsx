import { Box, styled, Theme } from '@mui/material';
import { MUIStyledCommonProps } from '@mui/system/createStyled';
import clsx from 'clsx';
import { platform } from 'os';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export const ButtonBase = styled('button')(({ theme }) => ({
    margin: 0,
    padding: theme.spacing(.5),
    display: 'flex',
    placeItems: 'center',
    placeContent: 'center',
    gap: theme.spacing(.75),
    fontWeight: platform() !== 'darwin' ? 400 : 300,
    background: 'none',
    border: 'none',
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.short
    }),
    cursor: 'default',
    userSelect: 'none',
    WebkitAppRegion: 'no-drag',
    '& .MuiSvgIcon-root': {
        color: 'inherit',
        fill: 'inherit'
    }
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

interface ButtonProps extends MUIStyledCommonProps<Theme>, ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode;
    children?: ReactNode;
}

export const Button = ({ icon, children, className, sx, ...props }: ButtonProps) => (
    <ButtonBase {...props} className={clsx('button', className)} sx={{ ...sx, pr: children ? 1 : .5 }}>
        {icon && <Box
            className="button-icon"
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

interface IconButtonProps extends MUIStyledCommonProps<Theme>, ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    size?: string | number;
}

export const IconButton = ({ children, size, className, sx, ...props }: IconButtonProps) => (
    <ButtonBase
        {...props}
        className={clsx('icon-button', className)}
        sx={{ ...sx, width: size ?? 'auto', height: size ?? 'auto' }}
    >
        {children}
    </ButtonBase>
);
