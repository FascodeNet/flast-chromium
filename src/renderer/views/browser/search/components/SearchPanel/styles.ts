import styled, { css } from 'styled-components';
import { AppearanceStyle } from '../../../../../../interfaces/user';
import { borderRadius } from '../../../../../themes';

interface StyledPanelProps {
    appearanceStyle: AppearanceStyle;
}

export const StyledPanel = styled.div<StyledPanelProps>`
  width: 100%;
  height: 34px;
  margin: 0;
  padding: 4px 12px;
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  gap: 12px;
  border-radius: ${borderRadius.toUnit()};
  // box-shadow: 0 12px 16px rgba(0, 0, 0, .12), 0 8px 10px rgba(0, 0, 0, .16);
  overflow: hidden;
  user-select: none;

  ${({ appearanceStyle }) => (appearanceStyle !== 'top_double') ? css`
    height: 34px;
    padding: 4px 12px;
  ` : css`
    height: 32px;
    padding: 3px 12px;
  `};
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

export const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-size: 13px;
  outline: none;
  border: none;
  background: none;
`;

