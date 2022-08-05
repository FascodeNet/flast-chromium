import { Box, Button, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import React, { Fragment, MouseEvent, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { BookmarkData, DefaultUserConfig, UserConfig } from '../../../../../../interfaces/user';
import { MenuMore } from '../../../../../components/Icons';
import { ArrowRight } from '../../../../../components/Icons/arrow';
import { AddFolder } from '../../../../../components/Icons/object';
import { Add, Edit, Remove } from '../../../../../components/Icons/state';
import { PageTitle, Section, SectionContent, SectionTitle } from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';
import { useBookmarksContext } from '../../contexts/bookmarks';
import { AddBookmarkDialog } from '../AddBookmarkDialog';
import { AddFolderDialog } from '../AddFolderDialog';
import { BookmarkItem } from '../App/styles';
import { DeleteDialog } from '../DeleteDialog';
import { MoveDialog } from '../MoveDialog';
import { RenameFolderDialog } from '../RenameFolderDialog';

interface Props {
    id?: string;
}

export const FolderView = ({ id }: Props) => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.bookmarks;

    useEffect(() => {
        window.flast.getUser().then(async (user) => {
            if (!user) return;
            setUserId(user);

            const userConfig = await window.flast.getUserConfig(userId);
            setConfig(userConfig);
        });
    }, []);

    const { bookmarks, removeBookmark } = useBookmarksContext();

    const folder = (id ? bookmarks.find((bookmark) => bookmark._id === id && bookmark.isFolder) : {
        title: translateSection.all
    }) as Required<BookmarkData> | undefined;

    const items = bookmarks.filter((bookmark) => bookmark.parent === id)
        .map((bookmark) => (bookmark) as Required<BookmarkData>)
        .sort((a, b) => a.title.localeCompare(b.title, 'ja'));
    const folderItems = items.filter((bookmark) => bookmark.isFolder);
    const bookmarkItems = items.filter((bookmark) => !bookmark.isFolder);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [dialogOpen, setDialogOpen] = useState<'add_bookmark' | 'add_folder' | 'delete' | 'rename_folder' | 'move' | undefined>(undefined);

    const [selected, setSelected] = useState<string[]>([]);

    const handleChecked = (targetId: string, checked: boolean) => {
        if (checked) {
            setSelected((selectedIds) => [...selectedIds, targetId]);
        } else {
            setSelected((selectedIds) => selectedIds.filter((selectedId) => selectedId !== targetId));
        }
    };

    const handleAddBookmarkClick = (e: MouseEvent<HTMLButtonElement>) => setDialogOpen('add_bookmark');

    const handleAddFolderClick = (e: MouseEvent<HTMLButtonElement>) => setDialogOpen('add_folder');

    const handleDeleteClick = async () => {
        if (!id) return;

        setAnchorEl(null);
        setDialogOpen('delete');
    };

    const handleRenameClick = () => {
        if (!folder) return;

        setAnchorEl(null);
        setDialogOpen('rename_folder');
    };

    const handleMoveClick = () => {
        setAnchorEl(null);
        setDialogOpen('move');
    };

    if (!folder) {
        // navigate('/', { replace: true });
        return (
            <Fragment>
                <Helmet title={`${translateSection.notFound} - ${translateSection.title}`} />
                <PageTitle>&nbsp;</PageTitle>
                <Section>
                    <SectionTitle>{translateSection.notFound}</SectionTitle>
                </Section>
            </Fragment>
        );
    }

    if (!bookmarks || bookmarks.length < 1) {
        return (
            <Fragment>
                <Helmet title={`${folder.title} - ${translateSection.title}`} />
                <PageTitle>{folder.title}</PageTitle>
                <Section>
                    <SectionTitle>{translateSection.notFound}</SectionTitle>
                </Section>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Helmet title={`${folder.title} - ${translateSection.title}`} />
            <PageTitle>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>{folder.title}</span>
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button onClick={handleAddBookmarkClick} startIcon={<Add />} color="inherit">
                            {translateSection.addBookmark}
                        </Button>
                        <Button onClick={handleAddFolderClick} startIcon={<AddFolder />} color="inherit">
                            {translateSection.addFolder}
                        </Button>
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <MenuMore />
                        </IconButton>
                    </Box>
                </Box>
            </PageTitle>
            <Section>
                <SectionContent>
                    {folderItems.map(({ _id, title }) => (
                        <BookmarkItem
                            key={_id}
                            id={_id}
                            title={title}
                            folder
                            checked={selected.includes(_id)}
                            setChecked={(checked) => handleChecked(_id, checked)}
                        />
                    ))}
                    {bookmarkItems.map(({ _id, title, url, favicon }) => (
                        <BookmarkItem
                            key={_id}
                            id={_id}
                            title={title}
                            url={url}
                            favicon={favicon}
                            checked={selected.includes(_id)}
                            setChecked={(checked) => handleChecked(_id, checked)}
                        />
                    ))}
                </SectionContent>
            </Section>

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
                <MenuItem onClick={handleRenameClick} disabled={!id}>
                    <ListItemIcon>
                        <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{translateSection.rename}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} disabled={!id}>
                    <ListItemIcon>
                        <Remove fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>{translateSection.delete}</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMoveClick} disabled={!id}>
                    <ListItemIcon>
                        <ArrowRight fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{translateSection.move}</ListItemText>
                </MenuItem>
            </Menu>

            <AddBookmarkDialog
                open={dialogOpen === 'add_bookmark'}
                onClose={() => setDialogOpen(undefined)}
                id={id}
            />
            <AddFolderDialog
                open={dialogOpen === 'add_folder'}
                onClose={() => setDialogOpen(undefined)}
                id={id}
            />
            <DeleteDialog
                open={dialogOpen === 'delete'}
                onClose={() => setDialogOpen(undefined)}
                id={id!!}
            />
            <RenameFolderDialog
                open={dialogOpen === 'rename_folder'}
                onClose={() => setDialogOpen(undefined)}
                id={id!!}
                label={folder.title}
            />
            <MoveDialog
                open={dialogOpen === 'move'}
                onClose={() => setDialogOpen(undefined)}
                id={id!!}
            />
        </Fragment>
    );
};
