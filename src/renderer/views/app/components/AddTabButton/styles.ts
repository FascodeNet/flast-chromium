import styled from 'styled-components';

export const StyledAddTabButton = styled.button`
  width: 32px;
  height: 32px;
  /*
  aspect-ratio: 1 / 1;
  height: 100%;
  */
  margin: 0;
  padding: 0;
  position: sticky;
  bottom: 0;
  right: 0;
  /*
  position: absolute;
  left: 0;
  */
  display: flex;
  place-content: center;
  place-items: center;
  flex-shrink: 0;
  transition: all .2s ease-out;
  outline-width: 2px;
  border-style: solid;
  border-width: 1px;
  border-radius: 50%;
  app-region: no-drag;
`;
