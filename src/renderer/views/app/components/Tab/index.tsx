import { CircularProgress } from '@mui/material';
import clsx from 'clsx';
import React, { Fragment, MouseEvent } from 'react';
import { ViewState } from '../../../../../interfaces/view';
import {
    APPLICATION_PROTOCOL,
    APPLICATION_WEB_BOOKMARKS,
    APPLICATION_WEB_DOWNLOADS,
    APPLICATION_WEB_EXTENSIONS,
    APPLICATION_WEB_HISTORY,
    APPLICATION_WEB_SETTINGS
} from '../../../../../utils';
import { Bookmarks, Downloads, Extensions, History, Remove, Settings } from '../../../../components/Icons';
import { useUserConfigContext } from '../../../../contexts/config';
import { useViewManagerContext } from '../../../../contexts/view';
import { useElectronAPI } from '../../../../utils/electron';
import {
    StyledHorizontalTab,
    StyledTabCloseButton,
    StyledTabIcon,
    StyledTabProgress,
    StyledTabTitle,
    StyledVerticalTab
} from './styles';

interface TabIconProps {
    url: string;
    favicon?: string;
}

const TabIcon = ({ url: urlString, favicon }: TabIconProps) => {
    const { protocol, hostname } = new URL(urlString);
    if (protocol === `${APPLICATION_PROTOCOL}:`) {
        const sxTheme = { width: 16, height: 16 };

        switch (hostname) {
            case APPLICATION_WEB_BOOKMARKS:
                return (<Bookmarks sx={sxTheme} />);
            case APPLICATION_WEB_HISTORY:
                return (<History sx={sxTheme} />);
            case APPLICATION_WEB_DOWNLOADS:
                return (<Downloads sx={sxTheme} />);
            case APPLICATION_WEB_SETTINGS:
                return (<Settings sx={sxTheme} />);
            case APPLICATION_WEB_EXTENSIONS:
                return (<Extensions sx={sxTheme} />);
            default:
                return (<StyledTabIcon favicon={favicon} />);
        }
    } else {
        return (<StyledTabIcon favicon={favicon} />);
    }
};

const TabProgress = () => (
    <StyledTabProgress>
        <CircularProgress />
    </StyledTabProgress>
);


interface TabProps {
    state: ViewState;

    isDragging: boolean;
    onMouseDown: (e: MouseEvent<HTMLDivElement>, id: number) => void;
    onMouseEnter: (e: MouseEvent<HTMLDivElement>, id: number) => void;
    onMouseLeave: (e: MouseEvent<HTMLDivElement>, id: number) => void;
}

export const HorizontalTab = (
    {
        state: { id, title, url, favicon, color, isLoading, isPinned },
        isDragging,
        onMouseDown,
        onMouseEnter,
        onMouseLeave
    }: TabProps
) => {
    const { selectedId } = useViewManagerContext();
    const { selectView, removeView, showTabMenu } = useElectronAPI();

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (id === selectedId) return;
        selectView(id);
    };

    const handleContextMenu = ({ pageX, pageY }: MouseEvent<HTMLDivElement>) => {
        showTabMenu(id, pageX, pageY);
    };

    return (
        <StyledHorizontalTab
            className={clsx('horizontal-tab-item', `horizontal-tab-item-${id}`)}
            style={{ zIndex: isDragging ? 2 : 'unset' }}
            active={id === selectedId} pinned={isPinned} themeColor={color} tabIndex={0}
            onClick={handleClick} onContextMenu={handleContextMenu}
            onMouseDown={(e) => onMouseDown(e, id)}
            onMouseEnter={(e) => onMouseEnter(e, id)}
            onMouseLeave={(e) => onMouseLeave(e, id)}
        >
            {!isLoading ? <TabIcon url={url} favicon={favicon} /> : <TabProgress />}
            {!isPinned && <Fragment>
                <StyledTabTitle>{title}</StyledTabTitle>
                <StyledTabCloseButton onClick={() => removeView(id)}>
                    <Remove />
                </StyledTabCloseButton>
            </Fragment>}
        </StyledHorizontalTab>
    );
};

export const VerticalTab = (
    {
        state: { id, title, url, favicon, color, isLoading, isPinned },
        isDragging,
        onMouseDown,
        onMouseEnter,
        onMouseLeave
    }: TabProps
) => {
    const { selectView, removeView, showTabMenu } = useElectronAPI();

    const { config } = useUserConfigContext();
    const { selectedId } = useViewManagerContext();

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (id === selectedId) return;
        selectView(id);
    };

    const handleContextMenu = ({ pageX, pageY }: MouseEvent<HTMLDivElement>) => {
        showTabMenu(id, pageX, pageY);
    };

    const isExtended = config.appearance.extended_sidebar;
    return (
        <StyledVerticalTab
            className={clsx('vertical-tab-item', `vertical-tab-item-${id}`)}
            style={{ zIndex: isDragging ? 2 : 'unset' }}
            active={id === selectedId} pinned={isPinned} themeColor={color} tabIndex={0} extended={isExtended}
            onClick={handleClick} onContextMenu={handleContextMenu}
            onMouseDown={(e) => onMouseDown(e, id)}
            onMouseEnter={(e) => onMouseEnter(e, id)}
            onMouseLeave={(e) => onMouseLeave(e, id)}
        >
            {!isLoading ? <TabIcon url={url} favicon={favicon} /> : <TabProgress />}
            {isExtended && <StyledTabTitle>{title}</StyledTabTitle>}
            {!isPinned && <StyledTabCloseButton onClick={() => removeView(id)}>
                <Remove />
            </StyledTabCloseButton>}
        </StyledVerticalTab>
    );
};
