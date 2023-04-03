import styled from 'styled-components';
import { borderRadius } from '../../../../../themes';

export const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 3px;

  & .MuiButtonBase-root.IconButton {
    width: 34px;
    height: 34px;
  }
`;

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
  outline-width: 2px;
  border-style: solid;
  border-width: 1px;
  border-radius: ${borderRadius.toUnit()};
  user-select: none;
  app-region: no-drag;
`;
