import styled from 'styled-components';
import { borderRadius } from '../../../../../themes';

export const StyledPanel = styled.div`
  width: 100%;
  height: 60px;
  margin: 0;
  padding: 4px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  box-shadow: 0 12px 16px rgba(0, 0, 0, .12), 0 8px 10px rgba(0, 0, 0, .16);
  overflow: hidden;
  user-select: none;

  @media (min-width: 700px) {
    border-radius: ${borderRadius.toUnit()};
  }
`;

export const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledIcon = styled.div`
  width: 36px;
  height: 36px;
  margin: 0;
  padding: 0;
  display: flex;
  place-content: center;
  place-items: center;
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0 12px;
  font-size: 18px;
  outline: none;
  border: none;
  background: none;
`;

export const StyledLabel = styled.span`
  width: 100%;
  padding: 0 12px;
  display: block;
  flex-shrink: 0;
  font-size: 11px;
  white-space: nowrap;
`;

