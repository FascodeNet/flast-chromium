import { platform } from 'os';
import styled, { css } from 'styled-components';
import { AppearanceStyle } from '../../../../../interfaces/user';

interface StyledProps {
    appearanceStyle: AppearanceStyle;
}

export const StyledTitleBar = styled.div<StyledProps>`
  width: 100%;
  height: ${({ appearanceStyle }) => appearanceStyle === 'top_double' ? '42px' : '50px'};
  display: grid;
  grid-template-columns: ${platform() !== 'darwin' ? '1fr 135px' : '76px 1fr'};
  grid-template-areas: ${platform() !== 'darwin' ? '\'title-bar-content window-controls\'' : '\'window-controls title-bar-content\''};
  app-region: drag;
`;

const getStyle = (style: AppearanceStyle) => {
    const isMac = platform() === 'darwin';
    switch (style) {
        case 'top_single':
            return css`
              padding: .5rem 1rem .5rem .5rem;
              ${!isMac ? css`
                grid-template-columns: calc(50px - 1rem) auto minmax(250px, 25%) 1px 1fr auto;
                grid-template-areas: 'application-menu navigation-bar address-bar divider horizontal-tab-container action-bar';
              ` : css`
                grid-template-columns: auto minmax(250px, 25%) 1px 1fr auto;
                grid-template-areas: 'navigation-bar address-bar divider horizontal-tab-container action-bar';
              `};
            `;
        case 'top_double':
            return css`
              padding: .5rem 1rem 0 .5rem;
              ${!isMac ? css`
                grid-template-columns: calc(50px - 1rem) 1fr;
                grid-template-areas: 'application-menu horizontal-tab-container';
              ` : css`
                grid-template-columns: 1fr;
                grid-template-areas: 'horizontal-tab-container';
              `};
            `;
        case 'left':
        case 'right':
            return css`
              padding: .5rem 1rem .5rem .5rem;
              ${!isMac ? css`
                grid-template-columns: calc(50px - 1rem) auto 1fr auto auto;
                grid-template-areas: 'application-menu navigation-bar address-bar extensions action-bar';
              ` : css`
                grid-template-columns: auto 1fr auto auto;
                grid-template-areas: 'navigation-bar address-bar extensions action-bar';
              `};
            `;
        default:
            return css`
              padding: .5rem 1rem .5rem .5rem;
              ${!isMac ? css`
                grid-template-columns: calc(50px - 1rem) auto 1fr auto auto;
                grid-template-areas: 'application-menu navigation-bar address-bar extensions action-bar';
              ` : css`
                grid-template-columns: auto 1fr auto auto;
                grid-template-areas: 'navigation-bar address-bar extensions action-bar';
              `};
            `;
    }
};

export const StyledContainer = styled.div<StyledProps>`
  width: 100%;
  height: inherit;
  grid-area: title-bar-content;
  display: grid;
  gap: 8px;

  ${({ appearanceStyle }) => getStyle(appearanceStyle)};
`;

export const StyledWindowControls = styled.div`
  width: 100%;
  height: inherit;
  grid-area: window-controls;
  app-region: no-drag;

  & > div {
    height: 100%;
  }
`;
