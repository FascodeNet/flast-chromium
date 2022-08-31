import { platform } from 'os';
import styled from 'styled-components';
import { borderRadius } from '../../../../../themes';

export const StyledPanel = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 4px 6px 4px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-weight: ${platform() !== 'darwin' ? 400 : 300};
  outline: none;
  border: none;
  background: none;
`;

export const StyledLabel = styled.span`
  width: 36px;
  display: block;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: ${platform() !== 'darwin' ? 400 : 300};
  text-align: center;
  white-space: nowrap;
`;

export const StyledButton = styled.button`
  width: 28px;
  height: 28px;
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
