import { Divider, IconButton, Link } from '@mui/material';
import React from 'react';
import {
    APPLICATION_PROTOCOL,
    APPLICATION_WEB_APPLICATIONS,
    APPLICATION_WEB_BOOKMARKS,
    APPLICATION_WEB_DOWNLOADS,
    APPLICATION_WEB_EXTENSIONS,
    APPLICATION_WEB_HISTORY,
    APPLICATION_WEB_HOME,
    APPLICATION_WEB_SETTINGS
} from '../../../utils';
import { Applications, Bookmarks, Download, Extension, History, Home, Settings } from '../Icons';
import { StyledDrawer } from './styles';

export const GlobalNavigationDrawer = () => (
    <StyledDrawer>
        <IconButton component={Link} href={`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HOME}`}>
            <Home />
        </IconButton>
        <Divider sx={{ width: 20, alignItems: 'center' }} />
        <IconButton component={Link} href={`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_BOOKMARKS}`}>
            <Bookmarks />
        </IconButton>
        <IconButton component={Link} href={`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HISTORY}`}>
            <History />
        </IconButton>
        <IconButton component={Link} href={`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_DOWNLOADS}`}>
            <Download />
        </IconButton>
        <IconButton component={Link} href={`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_APPLICATIONS}`}>
            <Applications />
        </IconButton>
        <Divider sx={{ width: 20, alignItems: 'center' }} />
        <IconButton component={Link} href={`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_SETTINGS}`}>
            <Settings />
        </IconButton>
        <IconButton component={Link} href={`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_EXTENSIONS}`}>
            <Extension />
        </IconButton>
    </StyledDrawer>
);
