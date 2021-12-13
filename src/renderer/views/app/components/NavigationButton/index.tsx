import React, { MouseEvent } from 'react';
import { ArrowLeft, ArrowRight, Home, Reload, Remove } from '../../../../components/Icons';
import { useViewManagerContext } from '../../../../contexts/view';
import { useElectronAPI } from '../../../../utils/electron';
import { StyledButton } from './styles';

export const BackButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { canGoBack } = getCurrentViewState();

    const { backView } = useElectronAPI();

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        backView(selectedId);
    };

    return (
        <StyledButton onClick={handleButtonClick} disabled={!canGoBack}>
            <ArrowLeft color={canGoBack ? 'action' : 'disabled'} />
        </StyledButton>
    );
};

export const ForwardButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { canGoForward } = getCurrentViewState();

    const { forwardView } = useElectronAPI();

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        forwardView(selectedId);
    };

    return (
        <StyledButton onClick={handleButtonClick} disabled={!canGoForward}>
            <ArrowRight color={canGoForward ? 'action' : 'disabled'} />
        </StyledButton>
    );
};

export const ReloadButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { isLoading } = getCurrentViewState();

    const { reloadView, stopView } = useElectronAPI();

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        !isLoading ? reloadView(selectedId) : stopView(selectedId);
    };

    return (
        <StyledButton onClick={handleButtonClick}>
            {!isLoading ? <Reload color="action" /> : <Remove color="action" />}
        </StyledButton>
    );
};

export const HomeButton = () => {
    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { isLoading } = getCurrentViewState();

    const { reloadView, stopView } = useElectronAPI();

    return (
        <StyledButton>
            <Home color="action" />
        </StyledButton>
    )
};
