import styled from 'styled-components';
import { getColor } from '../../../../themes';

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
  outline-color: ${({ theme }) => getColor(theme.palette.outline)};
  outline-width: 2px;
  background-color: ${({ theme }) => getColor(theme.palette.addTabButton)};
  border: solid 1px ${({ theme }) => getColor(theme.palette.addTabButton)};
  border-radius: 50%;
  app-region: no-drag;

  &:not(:disabled):hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
    border: solid 1px ${({ theme }) => theme.palette.divider};
  }
`;
