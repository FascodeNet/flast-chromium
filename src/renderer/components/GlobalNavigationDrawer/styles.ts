import styled from 'styled-components';

export const StyledDrawer = styled.div`
  width: 100%;
  height: 100%;
  padding: 3rem 8px;
  grid-area: global-navigation-drawer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border-right: solid 1px ${({ theme }) => theme.palette.divider};
`;
