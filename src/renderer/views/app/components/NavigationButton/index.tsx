import clsx from 'clsx';
import React from 'react';
import { ArrowLeft, ArrowRight, Home, Reload, Remove } from '../../../../components/Icons';
import { useViewManagerContext } from '../../../../contexts/view';
import { useElectronAPI } from '../../../../utils/electron';
import { StyledButton } from '../Button/styles';

export const BackButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { canGoBack } = getCurrentViewState();

    const { backView } = useElectronAPI();

    const handleButtonClick = () => {
        backView(selectedId);
    };

    return (
        <StyledButton className={clsx('navigation-button', 'back')} onClick={handleButtonClick} disabled={!canGoBack}>
            <ArrowLeft />
        </StyledButton>
    );
};

export const ForwardButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { canGoForward } = getCurrentViewState();

    const { forwardView } = useElectronAPI();

    const handleButtonClick = () => {
        forwardView(selectedId);
    };

    return (
        <StyledButton className={clsx('navigation-button', 'forward')} onClick={handleButtonClick}
                      disabled={!canGoForward}>
            <ArrowRight />
        </StyledButton>
    );
};

export const ReloadButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { isLoading } = getCurrentViewState();

    const { reloadView, stopView } = useElectronAPI();

    const handleButtonClick = () => {
        !isLoading ? reloadView(selectedId) : stopView(selectedId);
    };

    return (
        <StyledButton className={clsx('navigation-button', !isLoading ? 'reload' : 'stop')} onClick={handleButtonClick}>
            {!isLoading ? <Reload /> : <Remove />}
        </StyledButton>
    );
};

export const HomeButton = () => {
    const { selectedId } = useViewManagerContext();

    const { loadView } = useElectronAPI();

    const handleButtonClick = () => {
        loadView(selectedId, 'https://www.google.com');
    };

    return (
        <StyledButton className={clsx('navigation-button', 'home')} onClick={handleButtonClick}>
            <Home />
        </StyledButton>
    );
};
