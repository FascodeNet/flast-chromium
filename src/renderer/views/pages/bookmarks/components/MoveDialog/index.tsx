import { TreeItem, TreeItemContentProps, TreeView, useTreeItem } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material';
import clsx from 'clsx';
import React, { MouseEvent, SyntheticEvent, useState } from 'react';
import { BookmarkData } from '../../../../../../interfaces/user';
import { ArrowRight, ChevronDown, ChevronRight } from '../../../../../components/Icons/arrow';
import { Folder, Items } from '../../../../../components/Icons/object';
import { Remove } from '../../../../../components/Icons/state';
import { useTranslateContext } from '../../../../../contexts/translate';
import { useBookmarksContext } from '../../contexts/bookmarks';


const CustomContent = React.forwardRef((
    {
        classes,
        className,
        label,
        nodeId,
        icon: iconProp,
        expansionIcon,
        displayIcon
    }: TreeItemContentProps,
    ref
) => {
    const {
        disabled,
        expanded,
        selected,
        focused,
        handleExpansion,
        handleSelection,
        preventSelection
    } = useTreeItem(nodeId);

    const icon = iconProp || expansionIcon || displayIcon;

    const handleExpansionClick = (e: MouseEvent<HTMLDivElement>) => handleExpansion(e);

    const handleSelectionClick = (e: React.MouseEvent<HTMLDivElement>) => handleSelection(e);

    return (
        <Box
            className={clsx(className, classes.root, {
                [classes.expanded]: expanded,
                [classes.selected]: selected,
                [classes.focused]: focused,
                [classes.disabled]: disabled
            })}
            onMouseDown={handleSelectionClick}
            onDoubleClick={handleExpansionClick}
            ref={ref}
        >
            <Box onClick={handleExpansionClick} className={classes.iconContainer}>{icon}</Box>
            <Typography component="div" className={classes.label}>{label}</Typography>
        </Box>
    );
});

interface Props {
    open: boolean;
    onClose: () => void;
    id: string;
}

export const MoveDialog = ({ open, onClose, id }: Props) => {
    const { bookmarks, updateBookmark } = useBookmarksContext();

    const theme = useTheme();

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.bookmarks;

    const bookmarkData = bookmarks.find((bookmark) => bookmark._id === id);

    const items = bookmarks.filter((bookmark) => bookmark.isFolder)
        .map((bookmark) => (bookmark) as Required<BookmarkData>)
        .sort((a, b) => a.title.localeCompare(b.title, 'ja'));

    const [selected, setSelected] = useState<string>(bookmarkData?.parent ?? '0');

    const handleDialogClose = () => {
        onClose();
    };

    const handleMoveClick = async (e: MouseEvent<HTMLButtonElement>) => {
        await updateBookmark(id, { parent: selected !== '0' ? selected : undefined });
        handleDialogClose();
    };

    const handleCancelClick = (e: MouseEvent<HTMLButtonElement>) => handleDialogClose();

    const ChildTreeItem = ({ bookmark: { _id, title } }: { bookmark: Required<BookmarkData> }) => (
        <TreeItem
            nodeId={_id}
            label={
                <Box sx={{ p: .5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component={Folder} color="inherit" />
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {title}
                    </Typography>
                </Box>
            }
            ContentComponent={CustomContent}
        >
            {items.filter((item) => item.parent === _id).map((item) => (
                <ChildTreeItem key={item._id} bookmark={item} />
            ))}
        </TreeItem>
    );

    return (
        <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 300 }}>
                {translateSection.move}
            </DialogTitle>
            <DialogContent
                sx={{
                    pt: '4px !important',
                    pb: '12px !important',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <TreeView
                    selected={selected}
                    onNodeSelect={(_: SyntheticEvent, nodeId: string) => setSelected(nodeId)}
                    defaultExpanded={['0']}
                    defaultCollapseIcon={<ChevronDown />}
                    defaultExpandIcon={<ChevronRight />}
                    sx={{
                        width: '100%',
                        minHeight: 300,
                        border: `solid 2px ${theme.palette.primary.main}`,
                        borderRadius: 1
                    }}
                >
                    <TreeItem
                        nodeId="0"
                        label={
                            <Box sx={{ p: .5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box component={Items} color="inherit" />
                                <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                                    {translateSection.all}
                                </Typography>
                            </Box>
                        }
                        ContentComponent={CustomContent}
                    >
                        {items.filter((bookmark) => bookmark.parent === undefined).map((bookmark) => (
                            <ChildTreeItem key={bookmark._id} bookmark={bookmark} />
                        ))}
                    </TreeItem>
                </TreeView>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleCancelClick}
                    startIcon={<Remove />}
                >
                    {translate.common.cancel}
                </Button>
                <Button
                    onClick={handleMoveClick}
                    disabled={selected.length < 1 || selected === id || bookmarkData?.parent === id}
                    startIcon={<ArrowRight />}
                    variant="contained"
                >
                    {translateSection.move}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
