import styled from 'styled-components';

export const StyledHorizontalTabBar = styled.div`
  width: 100%;
  height: 100%;
  // position: relative;
  grid-area: horizontal-tab-container;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledVerticalTabBar = styled.div`
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

interface StyledVerticalTabBarToolContainerProps {
    extendedSidebar: boolean;
}

export const StyledVerticalTabBarToolContainer = styled.div<StyledVerticalTabBarToolContainerProps>`
  margin-top: auto;
  display: flex;
  flex-direction: ${({ extendedSidebar }) => extendedSidebar ? 'row' : 'column'};
  gap: 8px;
`;

export const StyledContainer = styled.div`
  width: calc(100% - 40px);
  height: 100%;
  // position: relative;
  /*
  display: flex;
  gap: 8px;
  */
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;
