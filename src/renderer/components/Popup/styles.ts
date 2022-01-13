import styled from 'styled-components';
import { borderRadius } from '../../themes';

export const StyledPopup = styled.div`
  width: calc(100% - 30px);
  height: calc(100% - 20px);
  margin: 0 15px 20px;
  background-color: #fff;
  box-shadow: 0 12px 16px rgba(0, 0, 0, .12), 0 8px 10px rgba(0, 0, 0, .16);
  border-radius: ${borderRadius.toUnit()};
`;
