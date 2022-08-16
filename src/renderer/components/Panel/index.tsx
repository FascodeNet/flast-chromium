import clsx from 'clsx';
import React from 'react';
import { useElectronAPI } from '../../utils/electron';
import { IconButton } from '../Button';
import { ExternalLink } from '../Icons/state';

export type PanelType = 'popup' | 'sidebar';

export interface PanelProps {
    type: PanelType;
}

interface PanelOpenButtonProps extends PanelProps {
    url: string;
}

export const PanelOpenButton = ({ url, type }: PanelOpenButtonProps) => {
    const { viewsApi, dialogApi } = useElectronAPI();

    const handleExternalClick = async () => {
        const viewStates = await viewsApi.getViews();
        const viewState = viewStates.find((state) => state.url.startsWith(url));

        if (viewState) {
            await viewsApi.select(viewState.id);
        } else {
            await viewsApi.add(url, true);
        }

        if (type === 'popup')
            await dialogApi.hide();
    };

    return (
        <IconButton onClick={handleExternalClick} className={clsx('panel-button', 'open')} sx={{ ml: 'auto' }}>
            <ExternalLink />
        </IconButton>
    );
};
