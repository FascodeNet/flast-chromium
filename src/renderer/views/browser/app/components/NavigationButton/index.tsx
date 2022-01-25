import clsx from 'clsx';
import React from 'react';
import { ArrowLeft, ArrowRight, Home, Reload, Remove } from '../../../../../components/Icons';
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
        <StyledButton className={clsx('navigation-button', 'back')} appearanceStyle={style}
                      onClick={handleButtonClick} disabled={!canGoBack}>
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
        <StyledButton className={clsx('navigation-button', 'forward')} appearanceStyle={style}
                      onClick={handleButtonClick} disabled={!canGoForward}>
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
        <StyledButton className={clsx('navigation-button', !isLoading ? 'reload' : 'stop')} appearanceStyle={style}
                      onClick={handleButtonClick}>
            {!isLoading ? <Reload /> : <Remove />}
        </StyledButton>
    );
};

export const HomeButton = () => {
    const { selectedId } = useViewManagerContext();

    const { loadView } = useElectronAPI();

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleButtonClick = () => {
        loadView(selectedId, 'https://www.google.com');
    };

    return (
        <StyledButton className={clsx('navigation-button', 'home')} appearanceStyle={style}
                      onClick={handleButtonClick}>
            <Home />
        </StyledButton>
    );
};
