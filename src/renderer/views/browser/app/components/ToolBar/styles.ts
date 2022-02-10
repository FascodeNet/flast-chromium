import styled from 'styled-components';
import { AppearanceStyle } from '../../../../../../interfaces/user';

interface StyledProps {
    appearanceStyle: AppearanceStyle;
}

export const StyledToolBar = styled.div<StyledProps>`
  width: 100%;
  padding: ${({ appearanceStyle }) => appearanceStyle !== 'top_double' ? '.5rem' : '4px 5px 3px'};
  grid-area: tool-bar;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  grid-template-areas: 'navigation-bar address-bar extensions action-bar';
  align-items: center;
  gap: 8px;
`;
