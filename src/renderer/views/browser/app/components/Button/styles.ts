import styled from 'styled-components';
import { AppearanceStyle } from '../../../../../../interfaces/user';
import { borderRadius } from '../../../../../themes';

interface StyledProps {
    appearanceStyle: AppearanceStyle;
}

export const StyledContainer = styled.div<StyledProps>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: ${({ appearanceStyle }) => appearanceStyle !== 'top_double' ? 3 : 5}px;
`;

export const StyledButton = styled.button<StyledProps>`
  width: ${({ appearanceStyle }) => appearanceStyle !== 'top_double' ? 34 : 32}px;
  height: ${({ appearanceStyle }) => appearanceStyle !== 'top_double' ? 34 : 32}px;
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
