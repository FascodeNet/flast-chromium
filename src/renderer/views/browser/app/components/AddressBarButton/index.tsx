import clsx from 'clsx';
import React, { MouseEvent } from 'react';
import { Extension } from '../../../../../components/Icons';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledButton } from '../Button/styles';

export const FindButton = () => {
    const { showExtensionsPopup } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        showExtensionsPopup(x, y + height);
    };

    return (
        <StyledButton className={clsx('address-bar-button', 'extensions')} appearanceStyle={style}
                      onClick={handleButtonClick}>
            <Extension />
        </StyledButton>
    );
};
