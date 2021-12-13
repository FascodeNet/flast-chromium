import React from 'react';
import { AddressBar } from '../AddressBar';
import { NavigationBar } from '../NavigationBar';
import { StyledToolBar } from './styles';

export const ToolBar = () => {
    return (
        <StyledToolBar>
            <NavigationBar />
            <AddressBar />
            <browser-action-list />
        </StyledToolBar>
    );
};
