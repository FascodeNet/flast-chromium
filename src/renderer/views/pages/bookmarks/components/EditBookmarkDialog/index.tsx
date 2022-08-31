import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { MouseEvent, useEffect, useState } from 'react';
import { Save } from '../../../../../components/Icons/object';
import { Remove } from '../../../../../components/Icons/state';
import { useTranslateContext } from '../../../../../contexts/translate';
import { useBookmarksContext } from '../../contexts/bookmarks';

interface Props {
    open: boolean;
    onClose: () => void;
    id: string;
    label?: string;
    url?: string;
}

export const EditBookmarkDialog = ({ open, onClose, id, label, url }: Props) => {
    const { updateBookmark } = useBookmarksContext();

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.bookmarks;

    const [labelInput, setLabelInput] = useState(label ?? '');
    const [urlInput, setUrlInput] = useState(url ?? '');

    useEffect(() => {
        if (!open) return;
        setLabelInput(label ?? '');
        setUrlInput(url ?? '');
    }, [open]);

    const handleDialogClose = () => {
        setLabelInput('');
        setUrlInput('');
        onClose();
    };

    const handleSaveClick = async (e: MouseEvent<HTMLButtonElement>) => {
        await updateBookmark(id, { title: labelInput, url: urlInput });
        handleDialogClose();
    };

    const handleCancelClick = (e: MouseEvent<HTMLButtonElement>) => handleDialogClose();

    return (
        <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 300 }}>
                {translateSection.edit}
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
                <TextField
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.currentTarget.value)}
                    type="url"
                    placeholder="URL"
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
                    onClick={handleSaveClick}
                    disabled={labelInput.length < 1 || urlInput.length < 1}
                    startIcon={<Save />}
                    variant="contained"
                >
                    {translate.common.save}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
