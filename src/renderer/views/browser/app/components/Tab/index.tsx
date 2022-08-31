import { getCurrentWebContents } from '@electron/remote';
import { CircularProgress } from '@mui/material';
import clsx from 'clsx';
import React, { Fragment, MouseEvent } from 'react';
import {
    APPLICATION_PROTOCOL,
    APPLICATION_WEB_APPLICATIONS,
    APPLICATION_WEB_BOOKMARKS,
    APPLICATION_WEB_DOWNLOADS,
    APPLICATION_WEB_EXTENSIONS,
    APPLICATION_WEB_HISTORY,
    APPLICATION_WEB_HOME,
    APPLICATION_WEB_SETTINGS,
    EXTENSION_PROTOCOL
} from '../../../../../../constants';
import { IExtension } from '../../../../../../interfaces/extension';
import { ViewState } from '../../../../../../interfaces/view';
import { Applications, Bookmarks, Download, Extension, History, Home, Settings } from '../../../../../components/Icons';
import { Remove } from '../../../../../components/Icons/state';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
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
                case APPLICATION_WEB_HOME:
                    return (<Home sx={sxTheme} />);
                case APPLICATION_WEB_BOOKMARKS:
                    return (<Bookmarks sx={sxTheme} />);
                case APPLICATION_WEB_HISTORY:
                    return (<History sx={sxTheme} />);
                case APPLICATION_WEB_DOWNLOADS:
                    return (<Download sx={sxTheme} />);
                case APPLICATION_WEB_APPLICATIONS:
                    return (<Applications sx={sxTheme} />);
                case APPLICATION_WEB_SETTINGS:
                    return (<Settings sx={sxTheme} />);
                case APPLICATION_WEB_EXTENSIONS:
                    return (<Extension sx={sxTheme} />);
                default:
                    return (<StyledTabIcon favicon={favicon} />);
            }
        } else if (protocol === `${EXTENSION_PROTOCOL}:`) {
            const extension: IExtension | null = getCurrentWebContents().session.getExtension(hostname);

            if (!extension)
                return (<StyledTabIcon favicon={favicon} />);

            const { path, manifest: { icons } } = extension;
            return (<StyledTabIcon favicon={`${path}/${icons!![64] ?? icons!![32] ?? icons!![128] ?? icons!![16]}`} />);
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
    const { viewsApi, viewApi } = useElectronAPI();

    const { config } = useUserConfigContext();
    const { style, tab_colored: isTabColored } = config.appearance;

    const handleClick = () => {
        if (id === selectedId) return;
        viewsApi.select(id);
    };

    const handleContextMenu = ({ pageX, pageY }: MouseEvent<HTMLDivElement>) => {
        viewApi.showTabMenu(id, pageX, pageY);
    };

    return (
        <StyledHorizontalTab
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onMouseDown={(e) => onMouseDown(e, id)}
            onMouseEnter={(e) => onMouseEnter(e, id)}
            onMouseLeave={(e) => onMouseLeave(e, id)}
            active={id === selectedId}
            pinned={isPinned}
            themeColor={isTabColored ? color : undefined}
            tabIndex={0}
            appearanceStyle={style}
            className={
                clsx(
                    'horizontal-tab-item',
                    id === selectedId && 'active',
                    isPinned && 'pinned',
                    isTabColored && color && 'colored',
                    `horizontal-tab-item-${id}`
                )
            }
            style={{ zIndex: isDragging ? 2 : 'unset' }}
        >
            {!isLoading ? <TabIcon url={url} favicon={favicon} /> : <TabProgress />}
            {!isPinned && <Fragment>
                <StyledTabTitle className="horizontal-tab-item-title">{title}</StyledTabTitle>
                <StyledTabCloseButton
                    onClick={() => viewsApi.remove(id)}
                    className={clsx('button', 'horizontal-tab-item-close-button')}
                >
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
    const { selectedId } = useViewManagerContext();
    const { viewsApi, viewApi } = useElectronAPI();

    const { config } = useUserConfigContext();
    const { tab_colored: isTabColored } = config.appearance;

    const handleClick = () => {
        if (id === selectedId) return;
        viewsApi.select(id);
    };

    const handleContextMenu = ({ pageX, pageY }: MouseEvent<HTMLDivElement>) => {
        viewApi.showTabMenu(id, pageX, pageY);
    };

    return (
        <StyledVerticalTab
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onMouseDown={(e) => onMouseDown(e, id)}
            onMouseEnter={(e) => onMouseEnter(e, id)}
            onMouseLeave={(e) => onMouseLeave(e, id)}
            active={id === selectedId}
            pinned={isPinned}
            themeColor={isTabColored ? color : undefined}
            extended={extended}
            tabIndex={0}
            className={
                clsx(
                    'vertical-tab-item',
                    id === selectedId && 'active',
                    isPinned && 'pinned',
                    isTabColored && color && 'colored',
                    `vertical-tab-item-${id}`
                )
            }
            style={{ zIndex: isDragging ? 2 : 'unset' }}
        >
            {!isLoading ? <TabIcon url={url} favicon={favicon} /> : <TabProgress />}
            {extended && <StyledTabTitle className="vertical-tab-item-title">{title}</StyledTabTitle>}
            {!isPinned && <StyledTabCloseButton
                onClick={() => viewsApi.remove(id)}
                className={clsx('button', 'vertical-tab-item-close-button')}
            >
                <Remove />
            </StyledTabCloseButton>}
        </StyledVerticalTab>
    );
};
