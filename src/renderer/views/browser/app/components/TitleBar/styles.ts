import { platform } from 'os';
import styled, { css } from 'styled-components';
import { WINDOW_TITLE_BAR_HEIGHT } from '../../../../../../constants/design';
import { AppearanceStyle } from '../../../../../../interfaces/user';

interface StyledProps {
    appearanceStyle: AppearanceStyle;
}

interface StyledTitleBarProps extends StyledProps {
    fullScreen: boolean;
}

export const StyledTitleBar = styled.div<StyledTitleBarProps>`
  width: 100%;
  height: ${({ appearanceStyle }) => appearanceStyle !== 'top_double' ? 50 : WINDOW_TITLE_BAR_HEIGHT}px;
  grid-area: title-bar;
  display: grid;
  grid-template-columns: ${({ fullScreen }) => fullScreen ? '1fr' : (platform() !== 'darwin' ? '1fr 135px' : '80px 1fr')};
  grid-template-areas: ${({ fullScreen }) => fullScreen ? '\'title-bar-content\'' : (platform() !== 'darwin' ? '\'title-bar-content window-controls\'' : '\'window-controls title-bar-content\'')};
  align-items: center;
  app-region: drag;
`;

export const StyledContainer = styled.div<StyledProps>`
  width: 100%;
  height: inherit;
  grid-area: title-bar-content;
  display: grid;
  align-items: center;
  gap: 8px;

  ${({ appearanceStyle }) => getStyle(appearanceStyle)};
`;

export const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  grid-area: wrapper;
  display: grid;
  grid-template-columns: minmax(250px, 25%) 1px 1fr;
  grid-template-areas: 'address-bar divider horizontal-tab-container';
  align-items: center;
  gap: 8px;

  @media screen and (min-width: 1000px) {
    grid-template-columns: minmax(300px, 30%) 1px 1fr;
  }
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


const getStyle = (style: AppearanceStyle) => {
    const isMac = platform() === 'darwin';
    switch (style) {
        case 'top_single':
            return css`
              ${!isMac ? css`
                padding: .5rem 1rem .5rem .5rem;
                grid-template-columns: calc(50px - 1rem) auto 1fr auto;
                grid-template-areas: 'application-menu navigation-bar wrapper action-bar';
              ` : css`
                padding: .5rem;
                grid-template-columns: auto 1fr auto;
                grid-template-areas: 'navigation-bar wrapper action-bar';
              `};
            `;
        case 'top_double':
            return css`
              padding: 0 5rem 0 0;
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
              ${!isMac ? css`
                padding: .5rem 1rem .5rem .5rem;
                grid-template-columns: calc(50px - 1rem) auto 1fr auto auto;
                grid-template-areas: 'application-menu navigation-bar address-bar extensions action-bar';
              ` : css`
                padding: .5rem;
                grid-template-columns: auto 1fr auto auto;
                grid-template-areas: 'navigation-bar address-bar extensions action-bar';
              `};
            `;
        default:
            return css`
              ${!isMac ? css`
                padding: .5rem 1rem .5rem .5rem;
                grid-template-columns: calc(50px - 1rem) auto 1fr auto auto;
                grid-template-areas: 'application-menu navigation-bar address-bar extensions action-bar';
              ` : css`
                padding: .5rem;
                grid-template-columns: auto 1fr auto auto;
                grid-template-areas: 'navigation-bar address-bar extensions action-bar';
              `};
            `;
    }
};
