import styled, { css } from 'styled-components';
import { AppearanceStyle } from '../../../../../interfaces/user';

interface StyledContainerProps {
    appearanceStyle: AppearanceStyle;
    extendedSideBar: boolean;
}

const getGridStyle = (style: AppearanceStyle, extended: boolean) => {
    const width = extended ? '300px' : '50px';
    switch (style) {
        case 'left':
            return css`
              grid-template-columns: ${width} 1fr;
              grid-template-areas: 'vertical-tab-container content';
            `;
        case 'right':
            return css`
              grid-template-columns: 1fr ${width};
              grid-template-areas: 'content vertical-tab-container';
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

  ${({ appearanceStyle, extendedSideBar }) => getGridStyle(appearanceStyle, extendedSideBar)};
`;
