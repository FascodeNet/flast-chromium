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
import { Bookmarks, Downloads, Extensions, Histories, Remove, Settings } from '../../../../components/Icons';
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
    try {
        const { protocol, hostname } = new URL(urlString);
        if (protocol === `${APPLICATION_PROTOCOL}:`) {
            const sxTheme = { width: 16, height: 16 };

            switch (hostname) {
                case APPLICATION_WEB_BOOKMARKS:
                    return (<Bookmarks sx={sxTheme} />);
                case APPLICATION_WEB_HISTORY:
                    return (<Histories sx={sxTheme} />);
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
    } catch {
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

    const { config } = useUserConfigContext();
    const style = config.appearance.style;

    const handleClick = () => {
        if (id === selectedId) return;
        selectView(id);
    };

    const handleContextMenu = ({ pageX, pageY }: MouseEvent<HTMLDivElement>) => {
        showTabMenu(id, pageX, pageY);
    };

    return (
        <StyledHorizontalTab
            className={
                clsx(
                    'horizontal-tab-item',
                    id === selectedId && 'active',
                    isPinned && 'pinned',
                    color && 'colored',
                    `horizontal-tab-item-${id}`
                )
            }
            style={{ zIndex: isDragging ? 2 : 'unset' }} appearanceStyle={style}
            active={id === selectedId} pinned={isPinned} themeColor={color} tabIndex={0}
            onClick={handleClick} onContextMenu={handleContextMenu}
            onMouseDown={(e) => onMouseDown(e, id)}
            onMouseEnter={(e) => onMouseEnter(e, id)}
            onMouseLeave={(e) => onMouseLeave(e, id)}
        >
            {!isLoading ? <TabIcon url={url} favicon={favicon} /> : <TabProgress />}
            {!isPinned && <Fragment>
                <StyledTabTitle className="horizontal-tab-item-title">{title}</StyledTabTitle>
                <StyledTabCloseButton className="horizontal-tab-item-close-button" onClick={() => removeView(id)}>
                    <Remove />
                </StyledTabCloseButton>
            </Fragment>}
        </StyledHorizontalTab>
    );
};

interface VerticalTabProps extends TabProps {
    extended: boolean;
}

export const VerticalTab = (
    {
        state: { id, title, url, favicon, color, isLoading, isPinned },
        isDragging,
        onMouseDown,
        onMouseEnter,
        onMouseLeave,
        extended
    }: VerticalTabProps
) => {
    const { selectView, removeView, showTabMenu } = useElectronAPI();

    const { selectedId } = useViewManagerContext();

    const handleClick = () => {
        if (id === selectedId) return;
        selectView(id);
    };

    const handleContextMenu = ({ pageX, pageY }: MouseEvent<HTMLDivElement>) => {
        showTabMenu(id, pageX, pageY);
    };

    return (
        <StyledVerticalTab
            className={
                clsx(
                    'vertical-tab-item',
                    id === selectedId && 'active',
                    isPinned && 'pinned',
                    color && 'colored',
                    `vertical-tab-item-${id}`
                )
            }
            style={{ zIndex: isDragging ? 2 : 'unset' }}
            active={id === selectedId} pinned={isPinned} themeColor={color} tabIndex={0} extended={extended}
            onClick={handleClick} onContextMenu={handleContextMenu}
            onMouseDown={(e) => onMouseDown(e, id)}
            onMouseEnter={(e) => onMouseEnter(e, id)}
            onMouseLeave={(e) => onMouseLeave(e, id)}
        >
            {!isLoading ? <TabIcon url={url} favicon={favicon} /> : <TabProgress />}
            {extended && <StyledTabTitle className="vertical-tab-item-title">{title}</StyledTabTitle>}
            {!isPinned &&
                <StyledTabCloseButton className="vertical-tab-item-close-button" onClick={() => removeView(id)}>
                    <Remove />
                </StyledTabCloseButton>}
        </StyledVerticalTab>
    );
};
