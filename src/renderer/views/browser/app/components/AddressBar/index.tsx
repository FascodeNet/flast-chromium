import { getCurrentWebContents } from '@electron/remote';
import {
    DescriptionOutlined,
    InfoOutlined,
    LanguageOutlined,
    LockOutlined,
    SearchOutlined,
    WarningAmberOutlined
} from '@mui/icons-material';
import clsx from 'clsx';
import { ipcRenderer } from 'electron';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { AppearanceStyle } from '../../../../../../interfaces/user';
import { ViewState } from '../../../../../../interfaces/view';
import { EXTENSION_PROTOCOL } from '../../../../../../utils';
import { isURL, prefixHttp } from '../../../../../../utils/url';
import { Extension } from '../../../../../components/Icons';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledAddressBar, StyledButton, StyledButtonContainer, StyledText, StyledTextContainer } from './styles';

export const AddressBar = () => {
    const { getWindowId, showSearchPopup } = useElectronAPI();

    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { config } = useUserConfigContext();

    const [state, setState] = useState<ViewState>(getCurrentViewState());
    const [statusButtonText, setStatusButtonText] = useState<string | undefined>(undefined);
    const [address, setAddress] = useState('');
    const [active, setActive] = useState(false);

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

        try {
            const { protocol, hostname } = new URL(url);

            if (protocol === `${EXTENSION_PROTOCOL}:`) {
                const extension = getCurrentWebContents().session.getExtension(hostname);
                setStatusButtonText(extension ? extension.name : undefined);
            } else {
                setStatusButtonText(undefined);
            }
        } catch {
            setStatusButtonText(undefined);
        }
    }, [selectedId, navigationState]);

    const ref = useRef<HTMLDivElement>(null);

    const handleClick = (_: MouseEvent<HTMLDivElement>) => {
        setActive(true);
        setTimeout(() => {
            const { x, y, width } = ref.current!!.getBoundingClientRect();
            showSearchPopup(x - 15 - 4, y, width + (15 * 2) + (4 * 2));
        });
    };

    const StatusIcon = (): JSX.Element => {
        if (!state.requestState || !state.requestState.type)
            return (<InfoOutlined />);

        switch (state.requestState.type) {
            case 'secure':
                return (<LockOutlined />);
            case 'insecure':
                return (<WarningAmberOutlined />);
            case 'search':
                return (<SearchOutlined />);
            case 'source':
            case 'file':
                return (<DescriptionOutlined />);
            case 'internal':
                return (<LanguageOutlined />);
            case 'extension':
                try {
                    const { protocol, hostname } = new URL(address);

                    if (protocol === `${EXTENSION_PROTOCOL}:`) {
                        const extension = getCurrentWebContents().session.getExtension(hostname);
                        return (extension ? <img src={`crx://extension-icon/${extension.id}/32/2`} /> :
                            <Extension />);
                    } else {
                        return (<Extension />);
                    }
                } catch {
                    return (<Extension />);
                }
        }
    };

    const style: AppearanceStyle = config.appearance.style;
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
            <StyledAddressBar ref={ref} className={clsx('address-bar', state.requestState?.type)}
                              active={active} appearanceStyle={style} onClick={handleClick}>
                <StyledButtonContainer>
                    <StyledButton text={statusButtonText}>
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
            </StyledAddressBar>
        );
    } catch (e) {
        return (
            <StyledAddressBar ref={ref} className="address-bar" active={active} appearanceStyle={style}
                              onClick={handleClick}>
                <StyledButtonContainer>
                    <StyledButton text={statusButtonText}>
                        <StatusIcon />
                    </StyledButton>
                </StyledButtonContainer>
                <StyledTextContainer className="address">
                    <StyledText>{address}</StyledText>
                </StyledTextContainer>
            </StyledAddressBar>
        );
    }
};
