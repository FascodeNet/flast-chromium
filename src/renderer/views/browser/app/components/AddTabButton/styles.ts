import styled from 'styled-components';
import { ADD_TAB_BUTTON_HEIGHT, ADD_TAB_BUTTON_WIDTH } from '../../../../../utils/tab';

export const StyledVerticalAddTabButton = styled.button`
  width: ${ADD_TAB_BUTTON_WIDTH}px;
  height: ${ADD_TAB_BUTTON_HEIGHT}px;
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
  border-radius: 50%;
  app-region: no-drag;

  & svg {
    font-size: 1.2rem;
  }
`;

export const StyledHorizontalAddTabButton = styled(StyledVerticalAddTabButton)`
  position: absolute;
  left: 0;
`;
