import { Box, Checkbox, Link, Typography } from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import { ButtonBase } from '../../../../components/Page';

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
    <ButtonBase onClick={() => setChecked(!checked)} disabled={disabled} sx={{ pl: .5, cursor: 'pointer' }}>
        <Checkbox checked={checked} onChange={() => setChecked(!checked)} disabled={disabled} />
        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 100 }}>
            {format(date, 'HH:mm')}
        </Typography>
        <Box
            sx={{
                width: 42,
                height: 42,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0
            }}
        >
            {favicon && <img src={favicon} style={{ width: 16, maxWidth: 16, height: 16, maxHeight: 16 }} />}
        </Box>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflow: 'hidden'
            }}
        >
            <Typography
                component={Link}
                href={url}
                color="inherit"
                underline="hover"
                variant="body1"
                sx={{
                    width: '100%',
                    textAlign: 'left',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    fontWeight: 300
                }}
            >
                {title}
            </Typography>
            <Typography variant="body2"
                        sx={{ color: 'text.secondary', fontWeight: 100 }}>{new URL(url).hostname}</Typography>
        </Box>
    </ButtonBase>
);
