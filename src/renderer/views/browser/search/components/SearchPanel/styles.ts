import { platform } from 'os';
import styled, { css } from 'styled-components';
import { borderRadius } from '../../../../../themes';

export const StyledPanel = styled.div`
  width: 100%;
  height: 34px;
  margin: 0;
  padding: 4px 0 4px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: ${borderRadius.toUnit()};
  overflow: hidden;
  user-select: none;
`;

export const StyledIcon = styled.div`
  width: 20px;
  height: 20px;
  margin: 0;
  padding: 0;
  display: flex;
  place-content: center;
  place-items: center;
`;

export const StyledImage = styled.img`
  width: 16px;
  max-width: 16px;
  height: 16px;
  max-height: 16px;
`;

export const StyledLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: ${platform() !== 'darwin' ? 400 : 300};
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-size: 13px;
  font-weight: ${platform() !== 'darwin' ? 400 : 300};
  outline: none;
  border: none;
  background: none;
`;

export const StyledButtonContainer = styled.div`
  height: 100%;
  margin: -4px 0 -4px -4px;
  padding: 0 2px 0 0;
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: default;
`;

interface StyledButtonProps {
    label?: string;
}

export const StyledButton = styled.button<StyledButtonProps>`
  min-width: 30px;
  height: 30px;
  margin: 0;
  padding: 5px;
  display: flex;
  place-content: center;
  place-items: center;
  flex-shrink: 0;
  gap: 6px;
  transition: all .2s ease-out;
  outline-width: 2px;
  border-style: solid;
  border-width: 1px;
  border-radius: ${borderRadius.toUnit()};
  cursor: default;
  user-select: none;

  svg, img {
    width: 20px;
    height: 20px;
  }

  ${({ label }) => label && css`
    &::after {
      content: '${label}';
      margin-bottom: 2px;
    }
  `};
`;
