import styled, { css } from 'styled-components';
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
  padding: 0 8px;
  grid-area: address-bar;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: all .4s ease-out;
  z-index: 2;
  outline-width: 2px;
  border-style: solid;
  border-width: 1px;
  border-radius: ${borderRadius.toUnit()};
  app-region: no-drag;

  & span {
    margin: -2px 0 0;
  }

  &, & span {
    flex-shrink: 0;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: text;

    &.path {
      flex-shrink: unset;
    }
  }

  ${({ active = false, appearanceStyle }) => (active && appearanceStyle === 'top_single') && css`
    grid-area: none;
    grid-row: 1 / 2;
    grid-column: 1 / 4;
  `};
`;
