import React from 'react';
import { useUserConfigContext } from '../../../../../contexts/config';
import { ActionBar } from '../ActionBar';
import { AddressBar } from '../AddressBar';
import { NavigationBar } from '../NavigationBar';
import { StyledToolBar } from './styles';

export const ToolBar = () => {
    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    return (
        <StyledToolBar className="tool-bar" appearanceStyle={style}>
            <NavigationBar />
            <AddressBar />
            <ActionBar />
        </StyledToolBar>
    );
};
