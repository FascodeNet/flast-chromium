import React from 'react';
import { useUserConfigContext } from '../../../../../contexts/config';
import { StyledContainer } from './styles';

export const TitleBar = () => {
    const {
        config: {
            appearance: {
                toolbar_position: position,
                tab_container: { position: tabContainerPosition, side: tabContainerSidePosition }
            }
        }
    } = useUserConfigContext();

    return (
        <StyledContainer
            className="title-bar"
            visible={position === 'bottom' && tabContainerPosition !== 'top'}
        />
    );
};
