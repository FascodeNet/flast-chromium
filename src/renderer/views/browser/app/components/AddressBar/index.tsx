import { getCurrentWebContents } from '@electron/remote';
import clsx from 'clsx';
import { ipcRenderer } from 'electron';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import Icon from '../../../../../../assets/icon.png';
import { APPLICATION_NAME, APPLICATION_PROTOCOL, EXTENSION_PROTOCOL } from '../../../../../../constants';
import { AppearanceStyle, BookmarkData } from '../../../../../../interfaces/user';
import { ViewState } from '../../../../../../interfaces/view';
import { isURL, prefixHttp } from '../../../../../../utils/url';
import { Extension, File, Search, Star, StarFilled } from '../../../../../components/Icons';
import { Information, Lock, Warning } from '../../../../../components/Icons/state';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledButton as Button } from '../Button/styles';
import { StyledAddressBar, StyledButton, StyledButtonContainer, StyledText, StyledTextContainer } from './styles';

export const AddressBar = () => {
    const {
        getWindowId,
        showSearchPopup,
        showInformationPopup,
        getBookmarks,
        addBookmark,
        removeBookmark
    } = useElectronAPI();

    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { userId, config } = useUserConfigContext();

    const [state, setState] = useState<ViewState>(getCurrentViewState());
    const [statusButtonLabel, setStatusButtonLabel] = useState<string | undefined>(undefined);
    const [address, setAddress] = useState('');
    const [active, setActive] = useState(false);
    const [bookmark, setBookmark] = useState<BookmarkData | undefined>(undefined);

    const windowId = getWindowId();
    useEffect(() => {
        ipcRenderer.on(`window-hide_search-${windowId}`, () => {
            setActive(false);
        });

        return () => {
            ipcRenderer.removeAllListeners(`window-hide_search-${windowId}`);
        };
    }, []);

    const navigationState = getCurrentViewState();
    useEffect(() => {
        const url = decodeURIComponent(navigationState?.url ?? '');
        setState(navigationState);
        setAddress(url);

        (async () => {
            const bookmarks = await getBookmarks(userId);
            setBookmark(bookmarks.find((data) => data.url === navigationState.url));
        })();

        try {
            const { protocol, hostname } = new URL(url);

            if (protocol === `${APPLICATION_PROTOCOL}:`) {
                setStatusButtonLabel(APPLICATION_NAME);
            } else if (protocol === `${EXTENSION_PROTOCOL}:`) {
                const extension = getCurrentWebContents().session.getExtension(hostname);
                setStatusButtonLabel(extension ? extension.name : undefined);
            } else {
                setStatusButtonLabel(undefined);
            }
        } catch {
            setStatusButtonLabel(undefined);
        }
    }, [selectedId, navigationState]);

    const ref = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        setActive(true);
        setTimeout(() => {
            const { x, y, width } = ref.current!!.getBoundingClientRect();
            showSearchPopup(x - 15 - 4, y, width + (15 * 2) + (4 * 2));
        });
        setTimeout(() => setActive(false), 500);
    };

    const handleInformationButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const { x, y, height } = e.currentTarget.getBoundingClientRect();
        showInformationPopup(x, y + height);
    };

    const handleBookmarkButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (bookmark) {
            await removeBookmark(userId, bookmark._id!!);
        } else {
            await addBookmark(
                userId,
                {
                    title: state.title,
                    url: state.url,
                    favicon: state.favicon,
                    isFolder: false
                }
            );
        }

        const bookmarks = await getBookmarks(userId);
        setBookmark(bookmarks.find((data) => data.url === navigationState.url));
    };

    const StatusIcon = (): JSX.Element => {
        if (!state.requestState || !state.requestState.type)
            return (<Information />);

        switch (state.requestState.type) {
            case 'secure':
                return (<Lock />);
            case 'insecure':
                return (<Warning />);
            case 'search':
                return (<Search />);
            case 'source':
            case 'file':
                return (<File />);
            case 'internal':
                return (<img src={Icon} style={{ filter: 'grayscale(1)' }} />);
            case 'extension':
                try {
                    const { protocol, hostname } = new URL(address);

                    if (protocol === `${EXTENSION_PROTOCOL}:`) {
                        const extension = getCurrentWebContents().session.getExtension(hostname);
                        return extension ? (
                            <img src={`crx://extension-icon/${extension.id}/32/2`} />
                        ) : (
                            <Extension />
                        );
                    } else {
                        return (<Extension />);
                    }
                } catch {
                    return (<Extension />);
                }
        }
    };

    const style: AppearanceStyle = config.appearance.style;
    if (window.outerWidth >= 850 || style !== 'top_single' || active) {
        try {
            const {
                protocol,
                hostname,
                port,
                pathname,
                search,
                hash
            } = new URL(isURL(address) && !address.includes('://') ? prefixHttp(address) : address);

            return (
                <StyledAddressBar
                    ref={ref}
                    onClick={handleClick}
                    className={clsx('address-bar', state.requestState?.type)}
                    active={active}
                    appearanceStyle={style}
                >
                    <StyledButtonContainer className="address-bar-container">
                        <StyledButton onClick={handleInformationButtonClick} label={statusButtonLabel}>
                            <StatusIcon />
                        </StyledButton>
                    </StyledButtonContainer>
                    <StyledTextContainer className="address">
                        <StyledText className="protocol">{protocol}//</StyledText>
                        <StyledText className="hostname">{hostname}</StyledText>
                        <StyledText className="path">
                            {decodeURIComponent(`${port !== '' ? `:${port}` : ''}${pathname}${search}${hash}`)}
                        </StyledText>
                    </StyledTextContainer>
                    <StyledButtonContainer className="address-bar-container">
                        <StyledButton onClick={handleBookmarkButtonClick}>
                            {bookmark ? <StarFilled /> : <Star />}
                        </StyledButton>
                    </StyledButtonContainer>
                </StyledAddressBar>
            );
        } catch (e) {
            return (
                <StyledAddressBar
                    ref={ref}
                    onClick={handleClick}
                    active={active}
                    className="address-bar"
                    appearanceStyle={style}
                >
                    <StyledButtonContainer className="address-bar-container">
                        <StyledButton label={statusButtonLabel}>
                            <StatusIcon />
                        </StyledButton>
                    </StyledButtonContainer>
                    <StyledTextContainer className="address">
                        <StyledText>{address}</StyledText>
                    </StyledTextContainer>
                </StyledAddressBar>
            );
        }
    } else {
        return (
            <Button onClick={handleClick} className={clsx('address-bar-button', 'search')} appearanceStyle={style}>
                <Search />
            </Button>
        );
    }
};
