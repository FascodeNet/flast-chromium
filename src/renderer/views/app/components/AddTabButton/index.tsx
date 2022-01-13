import React, { MouseEvent } from 'react';
import { Add } from '../../../../components/Icons';
import { useUserConfigContext } from '../../../../contexts/config';
import { useElectronAPI } from '../../../../utils/electron';
import { StyledAddTabButton } from './styles';

export const AddTabButton = () => {
    const { addView } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        addView('https://www.google.com', true);
    };

    return (
        <StyledAddTabButton className="add-tab-button" onClick={handleButtonClick} appearanceStyle={style}>
            <Add color="action" />
        </StyledAddTabButton>
    );
};
