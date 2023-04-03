import { styled as muiStyled } from '@mui/material';
import styled from 'styled-components';
import {
    WINDOW_DOUBLE_TAB_CONTAINER_HEIGHT,
    WINDOW_DOUBLE_TOOL_BAR_HEIGHT,
    WINDOW_SINGLE_APP_BAR_HEIGHT
} from '../../../../../../constants/design';
import { AppearanceTabContainerSidePosition, AppearanceToolbarPosition } from '../../../../../../interfaces/user';
import { IS_MAC } from '../../../../../../utils/process';

export const StyledContainer = muiStyled('div')<{
    position: AppearanceToolbarPosition;
    sidePosition: AppearanceTabContainerSidePosition;
}>(({ theme, position, sidePosition }) => ({
    width: '100%',
    gridRow: position === 'top' ? 1 : 3,
    gridColumn: '1 / 4',
    display: 'flex',
    flexDirection: (position === 'top' && sidePosition === 'inside') || (position === 'bottom' && sidePosition === 'outside') ? 'column-reverse' : 'column',
    appRegion: position === 'top' ? 'drag' : 'no-drag'
}));

export const StyledTabBar = muiStyled('div')<{
    position: AppearanceToolbarPosition;
    visible: boolean;
    trafficLightsPadding: string | number | null;
}>(({ theme, position, visible, trafficLightsPadding }) => ({
    width: '100%',
    height: WINDOW_DOUBLE_TAB_CONTAINER_HEIGHT,
    padding: theme.spacing(
        position === 'top' ? .75 : 0,
        .75,
        position === 'bottom' ? .75 : 0
    ),
    paddingLeft: IS_MAC && trafficLightsPadding ? trafficLightsPadding : theme.spacing(.75),
    display: visible ? 'flex' : 'none'
}));

export const StyledToolBar = muiStyled('div')<{
    position: AppearanceToolbarPosition;
    fullHeight: boolean;
    trafficLightsPadding: string | number | null;
}>(({ theme, position, fullHeight, trafficLightsPadding }) => ({
    width: '100%',
    height: fullHeight ? WINDOW_SINGLE_APP_BAR_HEIGHT : WINDOW_DOUBLE_TOOL_BAR_HEIGHT,
    padding: theme.spacing(fullHeight ? 1 : .5),
    paddingLeft: IS_MAC && trafficLightsPadding ? trafficLightsPadding : theme.spacing(fullHeight ? 1 : .5),
    gridRow: position === 'top' ? 1 : 3,
    gridColumn: '1 / 4',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    gridTemplateAreas: '\'navigation-bar address-bar action-bar\'',
    alignItems: 'center',
    gap: theme.spacing(1)
}));

export const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  grid-area: address-bar;
  display: grid;
  grid-template-columns: auto 1px 1fr;
  grid-template-areas: 'address-bar divider horizontal-tab-container';
  align-items: center;
  gap: 8px;

  @media screen and (min-width: 850px) {
    grid-template-columns: minmax(250px, 25%) 1px 1fr;
  }

  @media screen and (min-width: 1000px) {
    grid-template-columns: minmax(300px, 30%) 1px 1fr;
  }
`;
