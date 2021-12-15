import React, { FocusEvent, KeyboardEvent, useEffect, useState } from 'react';
import { AppearanceStyle, isHorizontal } from '../../../../../interfaces/user';
import { APPLICATION_PROTOCOL } from '../../../../../utils';
import { isURL } from '../../../../../utils/url';
import { useUserConfigContext } from '../../../../contexts/config';
import { useViewManagerContext } from '../../../../contexts/view';
import { useElectronAPI } from '../../../../utils/electron';
import { StyledAddressBar, StyledInput } from './styles';

export const AddressBar = () => {
    const { loadView } = useElectronAPI();

    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { config } = useUserConfigContext();

    const [address, setAddress] = useState('');
    const [inputActive, setInputActive] = useState(false);

    const navigationState = getCurrentViewState();
    useEffect(() => {
        if (inputActive) return;
        setAddress(decodeURIComponent(navigationState?.url ?? ''));
    }, [navigationState]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (isURL(address) && !address.includes('://')) {
                const url = `http://${address}`;
                loadView(selectedId, url);
                setAddress(decodeURIComponent(url));
            } else if (address.toLowerCase().startsWith('about:')) {
                const url = address.toLowerCase().includes('blank') ? address : address.replace('about:', `${APPLICATION_PROTOCOL}:`);
                loadView(selectedId, url);
                setAddress(decodeURIComponent(url));
            } else if (!address.includes('://')) {
                const url = 'https://www.google.com/search?q=%s'.replace('%s', encodeURIComponent(address));
                loadView(selectedId, url);
                setAddress(decodeURIComponent(url));
            } else {
                loadView(selectedId, address);
                setAddress(decodeURIComponent(address));
            }
        } else if (e.key === 'Escape') {
            const navigationState = getCurrentViewState();
            setAddress(decodeURIComponent(navigationState?.url ?? ''));

            setInputActive(false);
            e.currentTarget.blur();

            window.getSelection()?.removeAllRanges();
        }
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        setInputActive(true);
        setTimeout(() => {
            e.target.select();
        }, 100);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        setInputActive(false);
        e.target.blur();

        window.getSelection()?.removeAllRanges();
    };

    const style: AppearanceStyle = config.appearance.style;
    return (
        <StyledAddressBar className="address-bar" active={inputActive} appearanceStyle={style}>
            <StyledInput className="address-bar-input" value={address}
                         onChange={(e) => setAddress(e.target.value)} onKeyDown={handleKeyDown}
                         onFocus={handleFocus} onBlur={handleBlur} />
            {isHorizontal(style) && <browser-action-list />}
        </StyledAddressBar>
    );
};
