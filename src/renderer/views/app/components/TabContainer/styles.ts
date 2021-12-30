import styled from 'styled-components';

export const StyledHorizontalTabContainer = styled.div`
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