import clsx from 'clsx';
import React from 'react';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_HOME } from '../../../../../../constants';
import { isURL } from '../../../../../../utils/url';
import { IconButton } from '../../../../../components/Button';
import { ArrowLeft, ArrowRight, Home, Reload, Remove } from '../../../../../components/Icons';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';

export const BackButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { canGoBack } = getCurrentViewState();

    const { viewApi } = useElectronAPI();

    const handleButtonClick = () => {
        viewApi.back(selectedId);
    };

    return (
        <IconButton
            onClick={handleButtonClick}
            disabled={!canGoBack}
            size={34}
            className={clsx('navigation-button', 'back')}
        >
            <ArrowLeft />
        </IconButton>
    );
};

export const ForwardButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { canGoForward } = getCurrentViewState();

    const { viewApi } = useElectronAPI();

    const handleButtonClick = () => {
        viewApi.forward(selectedId);
    };

    return (
        <IconButton
            onClick={handleButtonClick}
            disabled={!canGoForward}
            size={34}
            className={clsx('navigation-button', 'forward')}
        >
            <ArrowRight />
        </IconButton>
    );
};

export const ReloadButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { isLoading } = getCurrentViewState();

    const { viewApi } = useElectronAPI();

    const handleButtonClick = () => {
        !isLoading ? viewApi.reload(selectedId, false) : viewApi.stop(selectedId);
    };

    return (
        <IconButton
            onClick={handleButtonClick}
            size={34}
            className={clsx('navigation-button', !isLoading ? 'reload' : 'stop')}
        >
            {!isLoading ? <Reload /> : <Remove />}
        </IconButton>
    );
};

export const HomeButton = () => {
    const { selectedId } = useViewManagerContext();

    const { viewApi } = useElectronAPI();

    const {
        config: {
            pages: { home, new_tab }
        }
    } = useUserConfigContext();

    const handleButtonClick = () => {
        viewApi.load(
            selectedId,
            home.mode === 'custom' && home.url && isURL(home.url) ? home.url : (new_tab.mode === 'custom' && new_tab.url && isURL(new_tab.url) ? new_tab.url : `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HOME}`)
        );
    };

    return (
        <IconButton
            onClick={handleButtonClick}
            size={34}
            className={clsx('navigation-button', 'home')}
        >
            <Home />
        </IconButton>
    );
};
