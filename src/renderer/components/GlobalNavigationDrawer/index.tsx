import { Divider, IconButton, Link } from '@mui/material';
import React from 'react';
import { APPLICATION_PROTOCOL } from '../../../utils';
import { Bookmarks, Download, Extension, History, Settings } from '../Icons';
import { StyledDrawer } from './styles';

export const GlobalNavigationDrawer = () => (
    <StyledDrawer>
        <IconButton component={Link} href={`${APPLICATION_PROTOCOL}://bookmarks`}>
            <Bookmarks />
        </IconButton>
        <IconButton component={Link} href={`${APPLICATION_PROTOCOL}://histories`}>
            <History />
        </IconButton>
        <IconButton component={Link} href={`${APPLICATION_PROTOCOL}://downloads`}>
            <Download />
        </IconButton>
        <Divider sx={{ width: 20, alignItems: 'center' }} />
        <IconButton component={Link} href={`${APPLICATION_PROTOCOL}://settings`}>
            <Settings />
        </IconButton>
        <IconButton component={Link} href={`${APPLICATION_PROTOCOL}://extensions`}>
            <Extension />
        </IconButton>
    </StyledDrawer>
);
