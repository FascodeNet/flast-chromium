import { useTheme } from '@mui/material';
import { platform } from 'os';
import React from 'react';
import { WindowsControls } from 'react-windows-controls';
import Icon from '../../../../../../assets/icon.png';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledContainer, StyledTitleBar } from './styles';

export const TitleBar = () => {
    const { windowApi } = useElectronAPI();

    const { palette } = useTheme();

    const isMac = platform() === 'darwin';

    return (
        <StyledTitleBar className="title-bar">
            <StyledContainer>
                {!isMac && <img src={Icon} />}
                <span>プロセス マネージャー</span>
            </StyledContainer>
            {!isMac &&
                <WindowsControls
                    dark={palette.mode === 'dark'}
                    style={{ appRegion: 'no-drag' }}
                    onMinimize={windowApi.minimize}
                    onMaximize={windowApi.maximize}
                    onClose={windowApi.close}
                />
            }
        </StyledTitleBar>
    );
};
