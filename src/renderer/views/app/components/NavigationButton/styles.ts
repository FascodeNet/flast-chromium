import styled from 'styled-components';
import { getColor } from '../../../../themes';

export const StyledButton = styled.button`
  width: 34px;
  height: 34px;
  margin: 0;
  padding: 0;
  display: flex;
  place-content: center;
  place-items: center;
  flex-shrink: 0;
  transition: all .2s ease-out;
  outline-color: ${({ theme }) => getColor(theme.palette.outline)};
  outline-width: 2px;
  background-color: transparent;
  border: solid 1px transparent;
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

  &:not(:disabled):hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
    border: solid 1px ${({ theme }) => theme.palette.divider};
    
    & img {
      filter: grayscale(0%);
    }
  }
`;
