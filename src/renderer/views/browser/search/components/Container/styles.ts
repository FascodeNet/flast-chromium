import styled from 'styled-components';
import { borderRadius } from '../../../../../themes';

export const StyledContainer = styled.div`
  width: calc(100% - 30px);
  height: 100%;
  max-height: calc(100% - 30px);
  margin: 0 15px 30px;
  // background-color: #fff;
  // box-shadow: 0 12px 16px rgba(0, 0, 0, .12), 0 8px 10px rgba(0, 0, 0, .16);
  border-radius: ${borderRadius.toUnit()};

  /*
  width: 100%;
  height: 100%;
  */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  // position: relative;
  // background-color: rgba(0, 0, 0, .7);
`;
