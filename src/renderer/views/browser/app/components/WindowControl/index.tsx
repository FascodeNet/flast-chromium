import React from 'react';
import { WindowsControls } from 'react-windows-controls';
import { useElectronAPI } from '../../../../../utils/electron';

export const WindowControl = () => {
    const { windowApi } = useElectronAPI();

    return (
        <WindowsControls
            onMinimize={windowApi.minimize}
            onMaximize={windowApi.maximize}
            onClose={windowApi.close}
        />
    );
};
