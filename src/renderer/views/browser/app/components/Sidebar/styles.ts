import styled, { css } from 'styled-components';
import { AppearanceSidebarState } from '../../../../../../interfaces/user';

interface StyledSidebarProps {
    extended: boolean;
    panel: AppearanceSidebarState;
}

export const StyledSidebar = styled.aside<StyledSidebarProps>`
  width: 100%;
  height: 100%;
  grid-area: sidebar;
  overflow: hidden;
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
