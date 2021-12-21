import styled from 'styled-components';

export const StyledApp = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 56px 300px 1fr;
  grid-template-areas: 'global-navigation-drawer navigation-drawer content';
`;

export const StyledAppContent = styled.main`
  max-width: 800px;
  width: 100%;
  height: 100%;
  padding: 3rem 2rem;
  grid-area: content;
`

export const StyledTitle = styled.h1`
  width: 100%;
  margin: 0 0 8px;
  align-self: flex-start;
  font-weight: 200;
  user-select: none;
`;

export const StyledSubTitle = styled.h2`
  width: 100%;
  margin: 0 0 4px;
  align-self: flex-start;
  font-weight: 200;
  user-select: none;
`;
