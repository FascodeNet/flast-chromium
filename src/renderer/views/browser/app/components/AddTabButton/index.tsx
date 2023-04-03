import clsx from 'clsx';
import React, { MouseEvent } from 'react';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_HOME } from '../../../../../../constants';
import { isURL } from '../../../../../../utils/url';
import { Add } from '../../../../../components/Icons';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledHorizontalAddTabButton, StyledVerticalAddTabButton } from './styles';

export const HorizontalAddTabButton = () => {
    const { viewsApi } = useElectronAPI();

    const {
        config: {
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
        <StyledHorizontalAddTabButton className={clsx('add-tab-button', 'horizontal')} onClick={handleButtonClick}>
            <Add color="action" />
        </StyledHorizontalAddTabButton>
    );
};

export const VerticalAddTabButton = () => {
    const { viewsApi } = useElectronAPI();

    const {
        config: {
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
        <StyledVerticalAddTabButton className={clsx('add-tab-button', 'vertical')} onClick={handleButtonClick}>
            <Add color="action" />
        </StyledVerticalAddTabButton>
    );
};
