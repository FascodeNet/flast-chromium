import React, { MouseEvent } from 'react';
import { Add } from '../../../../components/Icons';
import { useElectronAPI } from '../../../../utils/electron';
import { StyledAddTabButton } from './styles';

export const AddTabButton = () => {
    const { addView } = useElectronAPI();

    const handleButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        addView('https://www.google.com', true);
    };

    return (
        <StyledAddTabButton className="add-tab-button" onClick={handleButtonClick}>
            <Add color="action" />
        </StyledAddTabButton>
    );
};
