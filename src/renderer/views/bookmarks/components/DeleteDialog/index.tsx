import { DeleteOutlined } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { MouseEvent } from 'react';
import { Remove } from '../../../../components/Icons/state';
import { useTranslateContext } from '../../../../contexts/translate';
import { useBookmarksContext } from '../../contexts/bookmarks';

interface Props {
    open: boolean;
    onClose: () => void;
    id: string;
}

export const DeleteDialog = ({ open, onClose, id }: Props) => {
    const { removeBookmark } = useBookmarksContext();

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.bookmarks;

    const handleDialogClose = () => {
        onClose();
    };

    const handleDeleteClick = async (e: MouseEvent<HTMLButtonElement>) => {
        await removeBookmark(id);
        handleDialogClose();
    };

    const handleCancelClick = (e: MouseEvent<HTMLButtonElement>) => handleDialogClose();

    return (
        <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 300 }}>
                {translateSection.delete}
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

            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleCancelClick}
                    startIcon={<Remove />}
                >
                    {translate.common.cancel}
                </Button>
                <Button
                    onClick={handleDeleteClick}
                    startIcon={<DeleteOutlined />}
                    variant="contained"
                    color="error"
                >
                    {translate.common.delete}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
