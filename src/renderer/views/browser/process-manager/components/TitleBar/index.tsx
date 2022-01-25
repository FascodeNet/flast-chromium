import { useTheme } from '@mui/material';
import React from 'react';
import { WindowsControls } from 'react-windows-controls';
import Icon from '../../../../../../assets/icon.png';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledContainer, StyledTitleBar } from './styles';

export const TitleBar = () => {
    const { minimize, maximize, close } = useElectronAPI();

    const { palette } = useTheme();

    return (
        <StyledTitleBar>
            <StyledContainer>
                <img src={Icon} />
                <span>プロセス マネージャー</span>
            </StyledContainer>
            <WindowsControls
                dark={palette.mode === 'dark'}
                style={{ appRegion: 'no-drag' }}
                onMinimize={() => minimize()}
                onMaximize={() => maximize()}
                onClose={() => close()}
            />
        </StyledTitleBar>
    );
};
