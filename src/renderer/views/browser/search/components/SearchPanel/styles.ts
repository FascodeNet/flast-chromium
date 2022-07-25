import styled, { css } from 'styled-components';
import { AppearanceStyle } from '../../../../../../interfaces/user';
import { borderRadius } from '../../../../../themes';

interface StyledProps {
  appearanceStyle: AppearanceStyle;
}

export const StyledPanel = styled.div<StyledProps>`
  width: 100%;
  height: 34px;
  margin: 0;
  padding: 4px 0 4px 12px;
  display: grid;
  grid-template-columns: 20px 1fr auto;
  align-items: center;
  gap: 12px;
  border-radius: ${borderRadius.toUnit()};
  // box-shadow: 0 12px 16px rgba(0, 0, 0, .12), 0 8px 10px rgba(0, 0, 0, .16);
  overflow: hidden;
  user-select: none;

  ${({ appearanceStyle }) => (appearanceStyle !== 'top_double') ? css`
    height: 34px;
    padding: 4px 0 4px 12px;
  ` : css`
    height: 32px;
    padding: 3px 0 3px 12px;
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

export const StyledButtonContainer = styled.div<StyledProps>`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: default;

  ${({ appearanceStyle }) => (appearanceStyle !== 'top_double') ? css`
    margin: -4px 0 -4px -4px;
    padding: 0 2px 0 0;
  ` : css`
    margin: -3px 0 -3px -3px;
    padding: 0 2px 0 0;
  `};
`;

interface StyledButtonProps extends StyledProps {
  label?: string;
}

export const StyledButton = styled.button<StyledButtonProps>`
  margin: 0;
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

  ${({ appearanceStyle }) => (appearanceStyle !== 'top_double') ? css`
    min-width: 30px;
    height: 30px;
    padding: 5px;
  ` : css`
    min-width: 28px;
    height: 28px;
    padding: 4px;
  `};

  ${({ label }) => label && css`
    &::after {
      content: '${label}';
      margin-bottom: 2px;
    }
  `};
`;
