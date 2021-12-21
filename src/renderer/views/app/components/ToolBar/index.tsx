import React from 'react';
import { ActionBar } from '../ActionBar';
import { AddressBar } from '../AddressBar';
import { NavigationBar } from '../NavigationBar';
import { StyledToolBar } from './styles';

export const ToolBar = () => {
    return (
        <StyledToolBar className="tool-bar">
            <NavigationBar />
            <AddressBar />
            <browser-action-list />
            <ActionBar />
        </StyledToolBar>
    );
};
