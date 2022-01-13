import { getCurrentWebContents } from '@electron/remote';
import { Extension } from 'electron';
import React from 'react';
import { PanelProps } from '../Panel';
import { StyledPanel, StyledPanelContainer, StyledPanelHeader, StyledPanelTitle } from '../Panel/styles';
import { StyledExtensionItem, StyledExtensionItemIcon, StyledExtensionItemLabel } from './styles';
import Manifest = chrome.runtime.Manifest;

interface IExtension extends Extension {
    manifest: Manifest;
}

export const ExtensionsPanel = ({ type }: PanelProps) => {
    const extensions = getCurrentWebContents().session.getAllExtensions().sort(((a, b) => a.name > b.name ? 1 : -1));
    console.log(extensions);

    return (
        <StyledPanel className="panel" type={type}>
            <StyledPanelHeader className="panel-header" type={type}>
                <StyledPanelTitle className="panel-title">拡張機能</StyledPanelTitle>
            </StyledPanelHeader>
            <StyledPanelContainer className="panel-container">
                {extensions.map(({ name, path, manifest: { icons } }: IExtension, v) => (
                    <StyledExtensionItem key={v} className="extension-item" title={name}>
                        <StyledExtensionItemIcon
                            className="extension-item-icon"
                            icon={`${path}/${icons!![64] ?? icons!![32] ?? icons!![128] ?? icons!![16]}`}
                        />
                        <StyledExtensionItemLabel className="extension-item-label">
                            {name}
                        </StyledExtensionItemLabel>
                    </StyledExtensionItem>
                ))}
            </StyledPanelContainer>
        </StyledPanel>
    );
};
