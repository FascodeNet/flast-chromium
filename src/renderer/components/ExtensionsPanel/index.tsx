import { getCurrentWebContents } from '@electron/remote';
import { MoreVertOutlined } from '@mui/icons-material';
import { customAlphabet } from 'nanoid';
import React, { MouseEvent } from 'react';
import { IExtension } from '../../../interfaces/extension';
import { useViewManagerContext } from '../../contexts/view';
import { useElectronAPI } from '../../utils/electron';
import { PanelProps } from '../Panel';
import { StyledPanel, StyledPanelContainer, StyledPanelHeader, StyledPanelTitle } from '../Panel/styles';
import {
    StyledExtensionItem,
    StyledExtensionItemContainer,
    StyledExtensionItemIcon,
    StyledExtensionItemLabel,
    StyledExtensionItemMenuButton
} from './styles';

export const ExtensionsPanel = ({ type }: PanelProps) => {
    const extensions = getCurrentWebContents().session.getAllExtensions().sort(((a, b) => a.name > b.name ? 1 : -1));
    console.log(extensions);

    const { showExtensionMenu } = useElectronAPI();
    const { selectedId } = useViewManagerContext();

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>, id: string) => {
        const { x, y, height } = e.currentTarget.getBoundingClientRect();

        showExtensionMenu(id, x, y + height);
    };

    const randomTimestamp = customAlphabet('0123456789', 10);

    return (
        <StyledPanel className="panel" type={type}>
            <StyledPanelHeader className="panel-header" type={type}>
                <StyledPanelTitle className="panel-title">拡張機能</StyledPanelTitle>
            </StyledPanelHeader>
            <StyledPanelContainer className="panel-container">
                {extensions.map(({ id, name, path, url, manifest: { options_ui, icons } }: IExtension, v) => (
                    <StyledExtensionItem key={v} className="extension-item" title={name}>
                        <StyledExtensionItemContainer>
                            <StyledExtensionItemIcon
                                className="extension-item-icon"
                                icon={`crx://extension-icon/${id}/32/2?tabId=${selectedId}&t=${randomTimestamp()}`}
                            />
                            <StyledExtensionItemLabel className="extension-item-label">
                                {name}
                            </StyledExtensionItemLabel>
                        </StyledExtensionItemContainer>
                        <StyledExtensionItemMenuButton
                            className="extension-item-menu"
                            onClick={(e) => handleButtonClick(e, id)}
                        >
                            <MoreVertOutlined />
                        </StyledExtensionItemMenuButton>
                    </StyledExtensionItem>
                ))}
            </StyledPanelContainer>
        </StyledPanel>
    );
};
