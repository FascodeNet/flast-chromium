import styled, { css } from 'styled-components';
import { AppearanceStyle, isHorizontal } from '../../../../../interfaces/user';
import { getColor } from '../../../../themes';

interface StyledAddressBarProps {
    active?: boolean;
    appearanceStyle: AppearanceStyle;
}

export const StyledAddressBar = styled.div<StyledAddressBarProps>`
  width: 100%;
  height: 100%;
  grid-area: address-bar;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 3px;
  background-color: ${({ theme }) => getColor(theme.palette.addressBar)};
  border-radius: 8px;
  transition: all .4s ease-out;
  z-index: 2;

  & browser-action-list {
    display: none;
    app-region: no-drag;
  }

  ${({ active = false, appearanceStyle }) => (isHorizontal(appearanceStyle) && appearanceStyle !== 'top_double' && active) && css`
    width: calc(100vw - calc(calc(50px - 1rem) + 145px + 1rem + calc(143px + 1rem)));

    & browser-action-list {
      display: flex;
    }
  `};
`;

export const StyledTestContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 3px;
`;

export const StyledContainer = styled.div`
  width: fit-content;
  height: 100%;
  // padding: 3px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  // gap: 3px;
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 3px 8px;
  transition: all .2s ease-out;
  color: ${({ theme }) => theme.palette.text.primary};
  outline-color: ${({ theme }) => getColor(theme.palette.outline)};
  outline-width: 2px;
  background-color: ${({ theme }) => getColor(theme.palette.addressBar)};
  border: solid 1px ${({ theme }) => getColor(theme.palette.addressBar)};
  border-radius: 8px;
  app-region: no-drag;

  &:hover {
    border: solid 1px #d2d3d5;
  }
`;
