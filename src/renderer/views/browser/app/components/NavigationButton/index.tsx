import clsx from 'clsx';
import React from 'react';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_HOME } from '../../../../../../constants';
import { isURL } from '../../../../../../utils/url';
import { IconButton } from '../../../../../components/Button';
import { Home, Reload } from '../../../../../components/Icons';
import { ArrowLeft, ArrowRight } from '../../../../../components/Icons/arrow';
import { Remove } from '../../../../../components/Icons/state';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';

export const BackButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { canGoBack } = getCurrentViewState();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const { viewApi } = useElectronAPI();

    const handleButtonClick = () => {
        viewApi.back(selectedId);
    };

    return (
        <IconButton
            onClick={handleButtonClick}
            disabled={!canGoBack}
            disableRipple
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

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = () => {
        viewApi.forward(selectedId);
    };

    return (
        <IconButton
            onClick={handleButtonClick}
            disabled={!canGoForward}
            disableRipple
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

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = () => {
        !isLoading ? viewApi.reload(selectedId, false) : viewApi.stop(selectedId);
    };

    return (
        <IconButton
            onClick={handleButtonClick}
            disableRipple
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
            appearance: { style },
            pages: { home: { mode, url } }
        }
    } = useUserConfigContext();

    const handleButtonClick = () => {
        viewApi.load(
            selectedId,
            mode === 'custom' && url && isURL(url) ? url : `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HOME}`
        );
    };

    return (
        <IconButton onClick={handleButtonClick} disableRipple className={clsx('navigation-button', 'home')}>
            <Home />
        </IconButton>
    );
};
