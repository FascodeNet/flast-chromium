import React from 'react';
import { useUserConfigContext } from '../../../../../contexts/config';
import { BackButton, ForwardButton, HomeButton, ReloadButton } from '../NavigationButton';
import { StyledContainer } from './styles';

export const NavigationBar = () => {
    const { config } = useUserConfigContext();
    const { style, buttons: { home } } = config.appearance;

    return (
        <StyledContainer className="navigaton-bar" appearanceStyle={style}>
            <BackButton />
            <ForwardButton />
            <ReloadButton />
            {home && <HomeButton />}
        </StyledContainer>
    );
};
