import React, { MouseEvent } from 'react';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_HOME } from '../../../../../../constants';
import { isURL } from '../../../../../../utils/url';
import { Add } from '../../../../../components/Icons/state';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledAddTabButton } from './styles';

export const AddTabButton = () => {
    const { addView } = useElectronAPI();

    const {
        config: {
            appearance: { style },
            pages: { home: { mode, url } }
        }
    } = useUserConfigContext();

    const handleButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        await addView(mode === 'custom' && url && isURL(url) ? url : `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HOME}`, true);
    };

    return (
        <StyledAddTabButton className="add-tab-button" onClick={handleButtonClick} appearanceStyle={style}>
            <Add color="action" />
        </StyledAddTabButton>
    );
};
