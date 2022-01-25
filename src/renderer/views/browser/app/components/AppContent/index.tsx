import React from 'react';
import { isVertical } from '../../../../../../utils/design';
import { useUserConfigContext } from '../../../../../contexts/config';
import { Sidebar } from '../Sidebar';
import { StyledContainer } from './styles';

export const AppContent = () => {
    const { config } = useUserConfigContext();

    const { style, sidebar: { extended, state } } = config.appearance;
    return (
        <StyledContainer className="app-content" appearanceStyle={style} sidebarExtended={extended}
                         sidebarState={state}>
            {isVertical(style) && <Sidebar />}
        </StyledContainer>
    );
};
