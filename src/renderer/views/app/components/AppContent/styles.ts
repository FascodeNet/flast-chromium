import styled, { css } from 'styled-components';
import { WINDOW_EXTENDED_SIDEBAR_WIDTH, WINDOW_EXTENDED_TAB_CONTAINER_WIDTH } from '../../../../../constants/design';
import { AppearanceSidebarState, AppearanceStyle } from '../../../../../interfaces/user';

interface StyledContainerProps {
    appearanceStyle: AppearanceStyle;
    sidebarExtended: boolean;
    sidebarState: AppearanceSidebarState;
}

export const StyledContainer = styled.div<StyledContainerProps>`
  width: 100%;
  height: 100%;
  grid-area: content;
  display: grid;

  ${({ appearanceStyle, sidebarExtended, sidebarState }) =>
          getGridStyle(appearanceStyle, sidebarExtended, sidebarState)};
`;

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
