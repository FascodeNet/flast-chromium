import { platform } from 'os';
import styled, { css } from 'styled-components';
import { APPLICATION_NAME } from '../../../../../../constants';
import { AppearanceStyle } from '../../../../../../interfaces/user';
import { borderRadius } from '../../../../../themes';

interface StyledAddressBarProps {
    active?: boolean;
    appearanceStyle: AppearanceStyle;
}

export const StyledAddressBar = styled.div<StyledAddressBarProps>`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  grid-area: address-bar;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'left address right';
  align-items: center;
  gap: 8px;
  transition: all .4s ease-out;
  z-index: 2;
  outline-width: 2px;
  border-style: solid;
  border-width: 1px;
  border-radius: ${borderRadius.toUnit()};
  cursor: text;
  app-region: no-drag;

  ${({ active = false, appearanceStyle }) => (active && appearanceStyle === 'top_single') && css`
    grid-area: none;
    grid-row: 1 / 2;
    grid-column: 1 / 4;
  `};

  ${({ appearanceStyle }) => (appearanceStyle === 'top_double') && css`
    & .button, & .icon-button, ${StyledButton} {
      min-width: 28px !important;
      height: 28px !important;
      padding: 4px;
    }
  `};
`;

export const StyledTextContainer = styled.div`
  margin: -2px 0 0;
  padding: 0;
  grid-area: address;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const StyledText = styled.span`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: ${platform() !== 'darwin' ? 400 : 300};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const StyledButtonContainer = styled.div`
  height: 100%;
  padding: 1px;
  display: flex;
  align-items: center;
  gap: 1px;
  cursor: default;

  & .button, & .icon-button {
    min-width: 30px;
    height: 30px;
  }
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
      margin-bottom: ${label === APPLICATION_NAME ? 0 : 2}px;
    }
  `};
`;
