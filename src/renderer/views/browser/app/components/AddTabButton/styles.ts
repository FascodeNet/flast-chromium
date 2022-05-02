import styled from 'styled-components';
import { AppearanceStyle } from '../../../../../../interfaces/user';
import { isSingle } from '../../../../../../utils/design';

interface StyledProps {
    appearanceStyle: AppearanceStyle;
}

export const StyledAddTabButton = styled.button<StyledProps>`
  width: ${({ appearanceStyle }) => isSingle(appearanceStyle) ? 32 : 28}px;
  height: ${({ appearanceStyle }) => isSingle(appearanceStyle) ? 32 : 28}px;
  margin: ${({ appearanceStyle }) => appearanceStyle !== 'top_double' ? '0' : '0 0 0 4px'};
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

  & svg {
    font-size: ${({ appearanceStyle }) => isSingle(appearanceStyle) ? 1.5 : 1.2}rem;
  }
`;
