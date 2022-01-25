import styled from 'styled-components';
import { borderRadius } from '../../../../../themes';

export const StyledPanel = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: ${borderRadius.toUnit()};
  overflow: hidden;
  user-select: none;
`;

export const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0 4px;
  font-size: 13px;
  outline: none;
  border: none;
`;

export const StyledLabel = styled.span`
  width: 36px;
  display: block;
  flex-shrink: 0;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
`;

export const StyledButton = styled.button`
  aspect-ratio: 1 / 1;
  height: 100%;
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
  border-radius: ${borderRadius.toUnit()};
  user-select: none;
`;
