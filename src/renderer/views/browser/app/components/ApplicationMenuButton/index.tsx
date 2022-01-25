import React, { MouseEvent } from 'react';
import Icon from '../../../../../../assets/icon.png';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledApplicationMenuButton } from './styles';

export const ApplicationMenuButton = () => {
    const { showApplicationMenu } = useElectronAPI();

    const handleButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        showApplicationMenu();
    };

    return (
        <StyledApplicationMenuButton className="application-menu-button" onClick={handleButtonClick}>
            <img src={Icon} />
        </StyledApplicationMenuButton>
    );
};

