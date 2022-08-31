import { Box, Container, Paper, styled, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import { ItemButtonBase, ItemFavicon } from '../../../../../components/Page';

export const Page = styled(Box)({
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gridTemplateAreas: `
        'header'
        'content'
    `,
    backgroundImage: 'url(https://source.unsplash.com/random/1920x1280)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
});

export const PageContainer = styled(Container)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    position: 'relative'
}));

export const PageHeader = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2)
}));

interface SearchBoxPaperProps {
    suggestOpen?: boolean;
}

export const SearchBoxPaper = styled(
    Paper,
    { shouldForwardProp: (prop) => prop !== 'suggestOpen' }
)<SearchBoxPaperProps>(({ theme, suggestOpen }) => ({
    width: '100%',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    borderBottomLeftRadius: !suggestOpen ? 4 : 0,
    borderBottomRightRadius: !suggestOpen ? 4 : 0
}));

export const SuggestPaper = styled(Paper)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
}));

export const SuggestItem = styled(ItemButtonBase)(({ theme }) => ({
    width: '100%',
    height: 44,
    padding: 0
}));

interface SuggestItemIconProps {
    icon?: ReactNode;
}

interface SuggestItemTextBlockProps {
    primary?: ReactNode;
    secondary?: ReactNode;
}

export const SuggestItemIcon = ({ icon }: SuggestItemIconProps) => icon ? (
    <Box
        sx={{
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
        }}
    >
        {icon}
    </Box>
) : null;

export const SuggestItemFavicon = styled(ItemFavicon)({
    width: 20,
    minWidth: 20,
    height: 20,
    minHeight: 20
});

export const SuggestItemTextBlock = ({ primary, secondary }: SuggestItemTextBlockProps) => (
    <Box
        sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflow: 'hidden'
        }}
    >
        <Typography
            variant="body1"
            align="left"
            sx={{
                width: '100%',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                userSelect: 'none'
            }}
        >
            {primary}
        </Typography>
        {secondary && <Typography
            variant="body2"
            align="left"
            sx={{
                width: '100%',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                userSelect: 'none'
            }}
        >
            {secondary}
        </Typography>}
    </Box>
);
