import { Box, Checkbox, Link, styled, Typography } from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import { ItemButtonBase } from '../../../../../components/Page';

export const HistoryItemFavicon = styled(
    Box,
    { shouldForwardProp: (prop) => prop !== 'src' }
)<{ src?: string; }>(({ src }) => ({
    width: 16,
    minWidth: 16,
    height: 16,
    minHeight: 16,
    backgroundImage: src ? `url('${src}')` : 'unset',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain'
}));

interface HistoryItemProps {
    title: string;
    url: string;
    favicon?: string;
    date: Date;
    checked: boolean;
    setChecked: (checked: boolean) => void;
    disabled?: boolean;
}

export const HistoryItem = ({ title, url, favicon, date, checked, setChecked, disabled }: HistoryItemProps) => (
    <ItemButtonBase onClick={() => setChecked(!checked)} disabled={disabled} sx={{ pl: .5, cursor: 'pointer' }}>
        <Checkbox checked={checked} onChange={() => setChecked(!checked)} disabled={disabled} disableRipple />
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            {format(date, 'HH:mm')}
        </Typography>
        <Box
            sx={{
                width: 42,
                height: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}
        >
            <HistoryItemFavicon src={favicon} />
        </Box>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                overflow: 'hidden'
            }}
        >
            <Link
                href={url}
                color="inherit"
                underline="hover"
                variant="body1"
                align="left"
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                }}
            >
                {title}
            </Link>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                {new URL(url).hostname}
            </Typography>
        </Box>
    </ItemButtonBase>
);
