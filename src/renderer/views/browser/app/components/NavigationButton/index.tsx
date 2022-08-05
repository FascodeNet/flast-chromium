import clsx from 'clsx';
import React from 'react';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_HOME } from '../../../../../../utils';
import { isURL } from '../../../../../../utils/url';
import { Home, Reload } from '../../../../../components/Icons';
import { ArrowLeft, ArrowRight } from '../../../../../components/Icons/arrow';
import { Remove } from '../../../../../components/Icons/state';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledButton } from '../Button/styles';

export const BackButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { canGoBack } = getCurrentViewState();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const { backView } = useElectronAPI();

    const handleButtonClick = () => {
        backView(selectedId);
    };

    return (
        <StyledButton
            onClick={handleButtonClick}
            disabled={!canGoBack}
            appearanceStyle={style}
            className={clsx('navigation-button', 'back')}
        >
            <ArrowLeft />
        </StyledButton>
    );
};

export const ForwardButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { canGoForward } = getCurrentViewState();

    const { forwardView } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = () => {
        forwardView(selectedId);
    };

    return (
        <StyledButton
            onClick={handleButtonClick}
            disabled={!canGoForward}
            appearanceStyle={style}
            className={clsx('navigation-button', 'forward')}
        >
            <ArrowRight />
        </StyledButton>
    );
};

export const ReloadButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { isLoading } = getCurrentViewState();

    const { reloadView, stopView } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = () => {
        !isLoading ? reloadView(selectedId) : stopView(selectedId);
    };

    return (
        <StyledButton
            onClick={handleButtonClick}
            appearanceStyle={style}
            className={clsx('navigation-button', !isLoading ? 'reload' : 'stop')}
        >
            {!isLoading ? <Reload /> : <Remove />}
        </StyledButton>
    );
};

export const HomeButton = () => {
    const { selectedId } = useViewManagerContext();

    const { loadView } = useElectronAPI();

    const {
        config: {
            appearance: { style },
            pages: { home: { mode, url } }
        }
    } = useUserConfigContext();

    const handleButtonClick = () => {
        loadView(selectedId, mode === 'custom' && url && isURL(url) ? url : `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HOME}`);
    };

    return (
        <StyledButton
            onClick={handleButtonClick}
            appearanceStyle={style}
            className={clsx('navigation-button', 'home')}
        >
            <Home />
        </StyledButton>
    );
};
