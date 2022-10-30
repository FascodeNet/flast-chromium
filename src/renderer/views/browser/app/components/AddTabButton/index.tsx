import React, { MouseEvent } from 'react';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_HOME } from '../../../../../../constants';
import { isURL } from '../../../../../../utils/url';
import { Add } from '../../../../../components/Icons/state';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledAddTabButton } from './styles';

export const AddTabButton = () => {
    const { viewsApi } = useElectronAPI();

    const {
        config: {
            appearance: { style },
            pages: { new_tab: { mode, url } }
        }
    } = useUserConfigContext();

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        viewsApi.add(
            mode === 'custom' && url && isURL(url) ? url : `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HOME}`,
            true
        );
    };

    return (
        <StyledAddTabButton className="add-tab-button" onClick={handleButtonClick} appearanceStyle={style}>
            <Add color="action" />
        </StyledAddTabButton>
    );
};
