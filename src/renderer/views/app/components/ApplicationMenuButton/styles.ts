import styled from 'styled-components';

export const StyledApplicationMenuButton = styled.button`
  aspect-ratio: 1 / 1;
  height: 100%;
  margin: 0;
  padding: 0;
  grid-area: application-menu;
  display: flex;
  place-content: center;
  place-items: center;
  flex-shrink: 0;
  transition: all .2s ease-out;
  outline-width: 2px;
  border-style: solid;
  border-width: 1px;
  border-radius: 8px;
  user-select: none;
  app-region: no-drag;

  & img {
    aspect-ratio: 1 / 1;
    height: 80%;
    filter: grayscale(100%);
    user-select: none;
    transition: filter .2s;
  }

  &:hover {
    & img {
      filter: grayscale(0%);
    }
  }
`;

export const StyledContainer = styled.div`
  aspect-ratio: 1 / 1;
  height: 100%;
  margin: 0;
  padding: 5px;
`;
