import styled from 'styled-components';

export const StyledToolBar = styled.div`
  width: 100%;
  height: 50px;
  padding: .5rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'navigation-bar address-bar extensions';
  gap: 8px;
`;
