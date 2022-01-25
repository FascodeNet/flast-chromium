import styled from 'styled-components';
import { getColor } from '../../../../../themes';

export const StyledTitleBar = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 135px;
  background-color: ${({ theme }) => getColor(theme.palette.titleBar)};
  user-select: none;
  app-region: drag;
`;


export const StyledContainer = styled.div`
  width: 100%;
  height: inherit;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;

  & img {
    aspect-ratio: 1 / 1;
    height: 24px;
    user-select: none;
  }
`;
