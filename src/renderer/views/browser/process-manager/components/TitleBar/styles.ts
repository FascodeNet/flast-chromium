import { platform } from 'os';
import styled from 'styled-components';

export const StyledTitleBar = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 135px;
  user-select: none;
  app-region: drag;
`;


export const StyledContainer = styled.div`
  width: 100%;
  height: inherit;
  margin-left: ${platform() === 'darwin' ? 70 : 0}px;
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
