import { styled } from '@mui/material';

export const DownloadItem = styled('div')(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(.5),
    display: 'grid',
    gridTemplateColumns: '32px 1fr',
    gap: 4,
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.short
    })
}));

export const DownloadItemIconContainer = styled('div')({
    width: '100%',
    aspectRatio: '1 / 1',
    padding: 4
});

export const DownloadItemIcon = styled(
    'div',
    { shouldForwardProp: (prop) => prop !== 'src' }
)<{ src?: string; }>(({ src }) => ({
    width: 24,
    minWidth: 24,
    height: 24,
    minHeight: 24,
    backgroundImage: src ? `url('${src}')` : 'unset',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain'
}));

export const DownloadItemContent = styled('div')({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
});

export const DownloadItemTitle = styled('div')({
    width: '100%',
    height: 26,
    display: 'flex',
    alignItems: 'center',
    fontSize: 14
});

export const DownloadItemText = styled('div')({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    fontSize: 12
});

export const DownloadItemButtonContainer = styled('div')(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(.5)
}));

export const DownloadItemButton = styled('button')(({ theme }) => ({
    padding: theme.spacing(.5, 1),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.short
    })
}));
