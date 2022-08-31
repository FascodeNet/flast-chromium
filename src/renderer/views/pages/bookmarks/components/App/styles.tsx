import {
    Box,
    Checkbox,
    Divider,
    IconButton,
    Link,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    styled,
    Typography
} from '@mui/material';
import React, { Fragment, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { MenuMore } from '../../../../../components/Icons';
import { ArrowRight } from '../../../../../components/Icons/arrow';
import { Folder } from '../../../../../components/Icons/object';
import { Edit, Remove } from '../../../../../components/Icons/state';
import { ItemContainer } from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';
import { useBookmarksContext } from '../../contexts/bookmarks';
import { DeleteDialog } from '../DeleteDialog';
import { EditBookmarkDialog } from '../EditBookmarkDialog';
import { MoveDialog } from '../MoveDialog';
import { RenameFolderDialog } from '../RenameFolderDialog';

export const BookmarkItemFavicon = styled(
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

interface BookmarkItemProps {
    id: string;
    title: string;
    url?: string;
    favicon?: string;
    folder?: boolean;
    checked: boolean;
    setChecked: (checked: boolean) => void;
    disabled?: boolean;
}

export const BookmarkItem = ({ id, title, url, favicon, folder, checked, setChecked, disabled }: BookmarkItemProps) => {
    const { removeBookmark } = useBookmarksContext();

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [dialogOpen, setDialogOpen] = useState<'delete' | 'edit_bookmark' | 'rename_folder' | 'move' | undefined>(undefined);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.bookmarks;

    const handleDeleteClick = () => {
        setAnchorEl(null);
        setDialogOpen('delete');
    };

    const handleEditOrRenameClick = () => {
        setAnchorEl(null);
        setDialogOpen(!folder ? 'edit_bookmark' : 'rename_folder');
    };

    const handleMoveClick = () => {
        setAnchorEl(null);
        setDialogOpen('move');
    };

    return (
        <Fragment>
            <ItemContainer sx={{ pl: .5, pr: .75, '&:hover': { bgcolor: 'action.hover' } }}>
                <Checkbox checked={checked} onChange={() => setChecked(!checked)} disabled={disabled} disableRipple />
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
                    {folder ? <Folder /> : <BookmarkItemFavicon src={favicon} />}
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
                        component={folder ? RouterLink : 'a'}
                        {...(folder ? { to: `/${id}` } : { href: url })}
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
                    {!folder && url &&
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                            {new URL(url).hostname}
                        </Typography>
                    }
                </Box>
                <Box sx={{ ml: 'auto' }}>
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <MenuMore />
                    </IconButton>
                </Box>
            </ItemContainer>

            <Menu
                open={anchorEl !== null}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                sx={{ '& .MuiPaper-root': { width: 240 } }}
            >
                <MenuItem onClick={handleEditOrRenameClick}>
                    <ListItemIcon>
                        <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{folder ? translateSection.rename : translateSection.edit}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <ListItemIcon>
                        <Remove fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>{translateSection.delete}</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMoveClick}>
                    <ListItemIcon>
                        <ArrowRight fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{translateSection.move}</ListItemText>
                </MenuItem>
            </Menu>

            <DeleteDialog
                open={dialogOpen === 'delete'}
                onClose={() => setDialogOpen(undefined)}
                id={id!!}
            />
            <EditBookmarkDialog
                open={dialogOpen === 'edit_bookmark'}
                onClose={() => setDialogOpen(undefined)}
                id={id!!}
                label={title}
                url={url}
            />
            <RenameFolderDialog
                open={dialogOpen === 'rename_folder'}
                onClose={() => setDialogOpen(undefined)}
                id={id!!}
                label={title}
            />
            <MoveDialog
                open={dialogOpen === 'move'}
                onClose={() => setDialogOpen(undefined)}
                id={id!!}
            />
        </Fragment>
    );
};
