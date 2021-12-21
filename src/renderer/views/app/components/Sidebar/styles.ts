import styled, { css } from 'styled-components';
import { AppearanceSidebarState, AppearanceStyle } from '../../../../../interfaces/user';

interface StyledSidebarProps {
    appearanceStyle: AppearanceStyle;
    extended: boolean;
    panel: AppearanceSidebarState;
}

const getStyle = (style: AppearanceStyle, extended: boolean, state: AppearanceSidebarState) => {
    if (extended && state !== 'tab_container') {
        switch (style) {
            case 'left':
                return css`
                  display: grid;
                  grid-template-columns: 50px 1fr;
                  grid-template-rows: 1fr 200px;
                  grid-template-areas:
                    'vertical-tab-container panel'
                    'tool-bar panel';
                `;
            case 'right':
                return css`
                  display: grid;
                  grid-template-columns: 1fr 50px;
                  grid-template-rows: 1fr 200px;
                  grid-template-areas:
                    'panel vertical-tab-container'
                    'panel tool-bar';
                `;
        }
    } else {
        return css`
          display: flex;
          flex-direction: column;
          align-items: center;
        `;
    }
};

export const StyledSidebar = styled.aside<StyledSidebarProps>`
  width: 100%;
  height: 100%;
  grid-area: sidebar;
  overflow: hidden;

  ${({ appearanceStyle, extended, panel }) => getStyle(appearanceStyle, extended, panel)};
`;

export const StyledVerticalContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`;

interface StyledToolBarContainerProps {
    extended: boolean;
    panel: AppearanceSidebarState;
}

export const StyledToolBarContainer = styled.div<StyledToolBarContainerProps>`
  width: ${({ extended }) => extended ? '100%' : 'fit-content'};
  margin-top: auto;
  padding: 8px;
  ${({ extended, panel }) => extended && panel !== 'tab_container' ? css`
    grid-area: tool-bar;
    display: flex;
    flex-direction: column;
    align-items: center;
  ` : css`
    display: flex;
    flex-direction: ${extended ? 'row' : 'column'};
  `};
  gap: 8px;
`;
