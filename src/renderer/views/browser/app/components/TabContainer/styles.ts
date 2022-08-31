import styled from 'styled-components';
import { AppearanceStyle } from '../../../../../../interfaces/user';

interface StyledProps {
    appearanceStyle: AppearanceStyle;
}

export const StyledHorizontalTabContainer = styled.div`
  width: 100%;
  height: 100%;
  grid-area: horizontal-tab-container;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

export const StyledHorizontalTabWrapper = styled.div`
  width: calc(100% - 36px);
  height: 100%;
  position: relative;
  white-space: nowrap;
  overflow: auto hidden;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledVerticalTabContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  // position: relative;
  grid-area: vertical-tab-container;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  overflow: hidden auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;
