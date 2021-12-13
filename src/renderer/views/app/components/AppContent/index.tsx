import React from 'react';
import { isVertical } from '../../../../../interfaces/user';
import { useUserConfigContext } from '../../../../contexts/config';
import { VerticalTabBar } from '../TabBar';
import { StyledContainer } from './styles';

export const AppContent = () => {
    const { config } = useUserConfigContext();

    return (
        <StyledContainer appearanceStyle={config.appearance.style} extendedSideBar={config.appearance.extended_sidebar}>
            {isVertical(config.appearance.style) && <VerticalTabBar />}
        </StyledContainer>
    );
};
