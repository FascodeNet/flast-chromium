import clsx from 'clsx';
import React from 'react';
import { useElectronAPI } from '../../utils/electron';
import { ExternalLink } from '../Icons/state';
import { StyledPanelButton } from './styles';

export type PanelType = 'popup' | 'sidebar';

export interface PanelProps {
    type: PanelType;
}

interface PanelOpenButtonProps extends PanelProps {
    url: string;
}

export const PanelOpenButton = ({ url, type }: PanelOpenButtonProps) => {
    const { getViews, addView, selectView, hideDialog } = useElectronAPI();

    const handleExternalClick = async () => {
        const viewStates = await getViews();
        const viewState = viewStates.find((state) => state.url.startsWith(url));

        if (viewState) {
            await selectView(viewState.id);
        } else {
            await addView(url, true);
        }

        if (type === 'popup')
            await hideDialog();
    };

    return (
        <StyledPanelButton onClick={handleExternalClick} className={clsx('panel-button', 'open')}>
            <ExternalLink />
        </StyledPanelButton>
    );
};
