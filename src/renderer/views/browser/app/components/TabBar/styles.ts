import { styled } from '@mui/material';
import { WINDOW_DOUBLE_TAB_CONTAINER_HEIGHT, WINDOW_SINGLE_APP_BAR_HEIGHT } from '../../../../../../constants/design';
import { AppearanceTabContainerPosition, AppearanceToolbarPosition } from '../../../../../../interfaces/user';
import { IS_MAC } from '../../../../../../utils/process';

export const StyledHorizontalContainer = styled('div')<{
    position: AppearanceTabContainerPosition;
    visible: boolean;
    trafficLightsPadding: string | number | null;
}>(({ theme, position, visible, trafficLightsPadding }) => ({
    width: '100%',
    height: WINDOW_DOUBLE_TAB_CONTAINER_HEIGHT,
    padding: theme.spacing(.5),
    paddingLeft: IS_MAC && trafficLightsPadding ? trafficLightsPadding : theme.spacing(.5),
    gridRow: position === 'top' ? 1 : 3,
    gridColumn: '1 / 4',
    display: visible ? 'flex' : 'none'
}));

export const StyledVerticalContainer = styled('div')<{
    position: AppearanceToolbarPosition;
    tabContainerPosition: AppearanceTabContainerPosition;
    visible: boolean;
    fullScreened: boolean;
}>(({ theme, position, tabContainerPosition, visible, fullScreened }) => ({
    width: WINDOW_SINGLE_APP_BAR_HEIGHT,
    height: '100%',
    gridRow: position === 'top' ? '2 / 4' : (fullScreened ? '1 / 3' : 2),
    gridColumn: tabContainerPosition === 'left' ? 1 : 3,
    display: visible ? 'flex' : 'none'
}));
