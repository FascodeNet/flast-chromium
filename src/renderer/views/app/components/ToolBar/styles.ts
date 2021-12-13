import styled from 'styled-components';
import { getColor } from '../../../../themes';

export const StyledToolBar = styled.div`
  width: 100%;
  height: 50px;
  padding: .5rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'navigation-bar address-bar extensions';
  gap: 8px;
  background-color: ${({ theme }) => getColor(theme.palette.titleBar)};
`;
