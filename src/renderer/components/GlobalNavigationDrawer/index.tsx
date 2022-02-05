import { Divider, IconButton } from '@mui/material';
import React from 'react';
import { Bookmarks, Download, Extension, History, Settings } from '../Icons';
import { StyledDrawer } from './styles';

export const GlobalNavigationDrawer = () => {
    return (
        <StyledDrawer>
            <IconButton>
                <Bookmarks />
            </IconButton>
            <IconButton>
                <History />
            </IconButton>
            <IconButton>
                <Download />
            </IconButton>
            <Divider sx={{ width: 20, alignItems: 'center' }} />
            <IconButton>
                <Settings />
            </IconButton>
            <IconButton>
                <Extension />
            </IconButton>
        </StyledDrawer>
    );
};
