import styled, { css } from 'styled-components';
import { WINDOW_TITLE_BAR_HEIGHT, WINDOW_TOOL_BAR_HEIGHT } from '../../../../../constants/design';
import { AppearanceStyle } from '../../../../../interfaces/user';

interface StyledAppProps {
    appearanceStyle: AppearanceStyle;
}

export const StyledApp = styled.div<StyledAppProps>`
  width: 100%;
  height: 100%;
  display: grid;

  ${({ appearanceStyle }) => getGridStyle(appearanceStyle)};
`;

const getGridStyle = (style: AppearanceStyle) => {
    switch (style) {
        case 'top_double':
            return css`
              grid-template-rows: ${WINDOW_TITLE_BAR_HEIGHT}px ${WINDOW_TOOL_BAR_HEIGHT}px calc(100% - ${WINDOW_TITLE_BAR_HEIGHT + WINDOW_TOOL_BAR_HEIGHT}px);
              grid-template-areas:
                    'title-bar'
                    'tool-bar'
                    'content';
            `;
        default:
            return css`
              grid-template-rows: 50px calc(100% - 50px);
              grid-template-areas:
                    'title-bar'
                    'content';
            `;
    }
};
