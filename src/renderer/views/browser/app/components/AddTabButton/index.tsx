import React, { MouseEvent } from 'react';
import { Add } from '../../../../../components/Icons/state';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledAddTabButton } from './styles';

export const AddTabButton = () => {
    const { addView } = useElectronAPI();

    const { config: { appearance: { style }, pages: { home: { url } } } } = useUserConfigContext();

    const handleButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        await addView(url ?? 'https://www.google.com', true);
    };

    return (
        <StyledAddTabButton className="add-tab-button" onClick={handleButtonClick} appearanceStyle={style}>
            <Add color="action" />
        </StyledAddTabButton>
    );
};
