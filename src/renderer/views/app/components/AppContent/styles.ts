import styled, { css } from 'styled-components';
import { AppearanceSidebarState, AppearanceStyle } from '../../../../../interfaces/user';
import { WINDOW_EXTENDED_SIDEBAR_WIDTH, WINDOW_EXTENDED_TAB_CONTAINER_WIDTH } from '../../../../../utils';

interface StyledContainerProps {
    appearanceStyle: AppearanceStyle;
    sidebarExtended: boolean;
    sidebarState: AppearanceSidebarState;
}

const getGridStyle = (style: AppearanceStyle, extended: boolean, state: AppearanceSidebarState) => {
    const width = extended ? (state !== 'tab_container' ? `${WINDOW_EXTENDED_SIDEBAR_WIDTH}px` : `${WINDOW_EXTENDED_TAB_CONTAINER_WIDTH}px`) : '50px';
    switch (style) {
        case 'left':
            return css`
              grid-template-columns: ${width} 1fr;
              grid-template-areas: 'sidebar content';
            `;
        case 'right':
            return css`
              grid-template-columns: 1fr ${width};
              grid-template-areas: 'content sidebar';
            `;
        default:
            return css`
              grid-template-columns: 1fr;
              grid-template-areas: 'content';
            `;
    }
};

export const StyledContainer = styled.div<StyledContainerProps>`
  width: 100%;
  height: 100%;
  display: grid;

  ${({
       appearanceStyle,
       sidebarExtended,
       sidebarState
     }) => getGridStyle(appearanceStyle, sidebarExtended, sidebarState)};
`;
