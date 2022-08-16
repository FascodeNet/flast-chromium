import styled from 'styled-components';
import { borderRadius } from '../../../../../themes';

export const StyledContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  place-content: center;
  place-items: center;
  box-shadow: 0 12px 16px rgba(0, 0, 0, .12), 0 8px 10px rgba(0, 0, 0, .16);
  border-radius: ${borderRadius.toUnit()};
`;
