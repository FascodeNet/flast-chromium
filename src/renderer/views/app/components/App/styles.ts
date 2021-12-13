import styled, { css } from 'styled-components';
import { AppearanceStyle } from '../../../../../interfaces/user';

const getGridStyle = (style: AppearanceStyle) => {
    switch (style) {
        case 'top_double':
            return css`
              grid-template-rows: 42px 50px calc(100% - calc(42px + 50px));
            `;
        default:
            return css`
              grid-template-rows: 50px calc(100% - 50px);
            `;
    }
};

interface StyledAppProps {
    appearanceStyle: AppearanceStyle;
}

export const StyledApp = styled.div<StyledAppProps>`
  width: 100%;
  height: 100%;
  display: grid;

  ${({ appearanceStyle }) => getGridStyle(appearanceStyle)};
`;
