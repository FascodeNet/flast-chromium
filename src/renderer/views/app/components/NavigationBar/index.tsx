import React from 'react';
import { BackButton, ForwardButton, HomeButton, ReloadButton } from '../NavigationButton';
import { StyledContainer } from './styles';

export const NavigationBar = () => (
    <StyledContainer className="navigaton-bar">
        <BackButton />
        <ForwardButton />
        <ReloadButton />
        <HomeButton />
    </StyledContainer>
);
