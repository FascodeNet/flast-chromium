import React from 'react';
import { AddressBar } from '../AddressBar';
import { NavigationBar } from '../NavigationBar';
import { StyledToolBar } from './styles';

export const ToolBar = () => {
    return (
        <StyledToolBar className="tool-bar">
            <NavigationBar />
            <AddressBar />
            <browser-action-list />
        </StyledToolBar>
    );
};
