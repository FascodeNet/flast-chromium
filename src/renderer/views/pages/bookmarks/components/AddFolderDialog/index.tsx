import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { MouseEvent, useState } from 'react';
import { Add, Remove } from '../../../../../components/Icons/state';
import { useTranslateContext } from '../../../../../contexts/translate';
import { useBookmarksContext } from '../../contexts/bookmarks';

interface Props {
    open: boolean;
    onClose: () => void;
    id?: string;
}

export const AddFolderDialog = ({ open, onClose, id }: Props) => {
    const { addBookmark } = useBookmarksContext();

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.bookmarks;

    const [labelInput, setLabelInput] = useState('');

    const handleDialogClose = () => {
        setLabelInput('');
        onClose();
    };

    const handleAddClick = async (e: MouseEvent<HTMLButtonElement>) => {
        await addBookmark({ title: labelInput, isFolder: true, parent: id });
        handleDialogClose();
    };

    const handleCancelClick = (e: MouseEvent<HTMLButtonElement>) => handleDialogClose();

    return (
        <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 300 }}>{translateSection.addFolder}</DialogTitle>
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
                <TextField
                    value={labelInput}
                    onChange={(e) => setLabelInput(e.currentTarget.value)}
                    type="text"
                    placeholder="Name"
                    fullWidth
                    size="small"
                    margin="none"
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleCancelClick}
                    startIcon={<Remove />}
                >
                    {translate.common.cancel}
                </Button>
                <Button
                    onClick={handleAddClick}
                    disabled={labelInput.length < 1}
                    startIcon={<Add />}
                    variant="contained"
                >
                    {translate.common.add}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
