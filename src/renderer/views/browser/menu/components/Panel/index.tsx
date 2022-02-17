import { Divider } from '@mui/material';
import React, { ReactNode } from 'react';
import { getTranslate } from '../../../../../../languages/language';
import {
    Applications,
    Bookmarks,
    Download,
    Extension,
    Find,
    History,
    Print,
    Remove,
    Settings,
    Share
} from '../../../../../components/Icons';
import { TabAdd } from '../../../../../components/Icons/tab';
import { WindowAdd, WindowIncognito } from '../../../../../components/Icons/window';
import { useUserConfigContext } from '../../../../../contexts/config';
import { StyledItem, StyledItemIcon, StyledItemLabel, StyledPanel, StyledPanelContainer } from './styles';

interface ItemProps {
    icon?: ReactNode;
    label: ReactNode;
}

const Item = ({ icon, label }: ItemProps) => (
    <StyledItem className="menu-item">
        <StyledItemIcon className="menu-item-icon">{icon}</StyledItemIcon>
        <StyledItemLabel className="menu-item-label">{label}</StyledItemLabel>
    </StyledItem>
);

export const Panel = () => {

    const { config } = useUserConfigContext();

    const translate = getTranslate(config);

    return (
        <StyledPanel className="panel">
            <StyledPanelContainer className="panel-container">
                <Item icon={<TabAdd />} label={translate.menus.application.newTab} />
                <Item icon={<WindowAdd />} label={translate.menus.application.newWindow} />
                <Item icon={<WindowIncognito />} label={translate.menus.application.openIncognitoWindow} />
                <Divider flexItem sx={{ my: .5 }} />
                <Item icon={<Bookmarks />} label={translate.menus.application.bookmarks} />
                <Item icon={<History />} label={translate.menus.application.histories} />
                <Item icon={<Download />} label={translate.menus.application.downloads} />
                <Item icon={<Applications />} label={translate.menus.application.applications} />
                <Item icon={<Extension />} label={translate.menus.application.extensions} />
                <Divider flexItem sx={{ my: .5 }} />
                <Item icon={<Print />} label={translate.menus.application.print} />
                <Item icon={<Find />} label={translate.menus.application.find} />
                <Item icon={<Share />} label={translate.menus.application.share} />
                <Divider flexItem sx={{ my: .5 }} />
                <Item icon={<Settings />} label={translate.menus.application.settings} />
                <Item icon={<History />} label={translate.menus.application.help.label} />
                <Item icon={<Remove />} label={translate.menus.application.close} />
            </StyledPanelContainer>
        </StyledPanel>
    );
};
