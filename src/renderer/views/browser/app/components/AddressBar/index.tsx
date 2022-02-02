import clsx from 'clsx';
import { ipcRenderer } from 'electron';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { AppearanceStyle } from '../../../../../../interfaces/user';
import { ViewState } from '../../../../../../interfaces/view';
import { isURL, prefixHttp } from '../../../../../../utils/url';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledAddressBar } from './styles';

export const AddressBar = () => {
    const { getWindowId, showSearchPopup } = useElectronAPI();

    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { config } = useUserConfigContext();

    const [state, setState] = useState<ViewState>(getCurrentViewState());
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
        console.log(navigationState);
        setState(navigationState);
        setAddress(decodeURIComponent(navigationState?.url ?? ''));
    }, [selectedId, navigationState]);

    const ref = useRef<HTMLDivElement>(null);

    const handleClick = (_: MouseEvent<HTMLDivElement>) => {
        setActive(true);
        setTimeout(() => {
            const { x, y, width } = ref.current!!.getBoundingClientRect();
            showSearchPopup(x - 15 - 4, y, width + (15 * 2) + (4 * 2));
        });
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
                <span className="protocol">{protocol}//</span>
                <span className="hostname">{hostname}</span>
                <span
                    className="path">{decodeURIComponent(`${port !== '' ? `:${port}` : ''}${pathname}${search}${hash}`)}</span>
            </StyledAddressBar>
        );
    } catch (e) {
        return (
            <StyledAddressBar ref={ref} className="address-bar" active={active} appearanceStyle={style}
                              onClick={handleClick}>
                <span>{address}</span>
            </StyledAddressBar>
        );
    }
};
