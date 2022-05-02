import { useTheme } from '@mui/material';
import { platform } from 'os';
import React from 'react';
import { WindowsControls } from 'react-windows-controls';
import Icon from '../../../../../../assets/icon.png';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledContainer, StyledTitleBar } from './styles';

export const TitleBar = () => {
    const { minimize, maximize, close } = useElectronAPI();

    const { palette } = useTheme();

    const isMac = platform() === 'darwin';

    return (
        <StyledTitleBar>
            <StyledContainer>
                {!isMac && <img src={Icon} />}
                <span>プロセス マネージャー</span>
            </StyledContainer>
            {!isMac &&
                <WindowsControls
                    dark={palette.mode === 'dark'}
                    style={{ appRegion: 'no-drag' }}
                    onMinimize={() => minimize()}
                    onMaximize={() => maximize()}
                    onClose={() => close()}
                />
            }
        </StyledTitleBar>
    );
};
