import Color from 'color';
import { platform } from 'os';
import styled, { css } from 'styled-components';
import { AppearanceStyle } from '../../../../../../interfaces/user';
import { isSingle } from '../../../../../../utils/design';
import { borderRadius } from '../../../../../themes';
import { TAB_MAX_WIDTH } from '../../../../../utils/tab';

interface StyledTabIconProps {
  favicon?: string;
}

export const StyledTabProgress = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  place-content: center;
  place-items: center;
  line-height: 16px;

  & span, & svg {
    width: 16px !important;
    height: 16px !important;
  }
`;

export const StyledTabIcon = styled.div<StyledTabIconProps>`
  width: 16px;
  min-width: 16px;
  height: 16px;
  min-height: 16px;
  line-height: 16px;

  ${({ favicon }) => favicon && css`
    background-image: url('${favicon}');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  `}
`;

export const StyledTabTitle = styled.span`
  width: 100%;
  font-size: 12px;
  font-weight: ${platform() !== 'darwin' ? 400 : 300};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const StyledTabCloseButton = styled.button`
  aspect-ratio: 1 / 1;
  height: 20px;
  margin: 0;
  padding: 0;
  place-content: center;
  place-items: center;
  flex-shrink: 0;
  transition: all .2s ease-out;
  outline-width: 2px;
  background-color: transparent;
  border: solid 1px transparent;

  & svg {
    width: 12px;
    height: 12px;
  }
`;

interface StyledTabProps {
  active?: boolean;
  pinned?: boolean;
  themeColor?: string;
}

interface StyledHorizontalTabProps extends StyledTabProps {
  appearanceStyle: AppearanceStyle;
}

export const StyledHorizontalTab = styled.div<StyledHorizontalTabProps>`
  max-width: ${TAB_MAX_WIDTH}px;
  height: 100%;
  padding: 0 5px 0 7px;
  position: absolute;
  left: 0;
  display: flex;
  align-self: center;
  align-content: center;
  align-items: center;
  gap: 5px;
  user-select: none;
  outline-width: 2px;
  border-style: solid;
  border-width: 2px;
  app-region: no-drag;

  ${({ appearanceStyle }) => isSingle(appearanceStyle) ? css`
    border-radius: ${borderRadius.toUnit()};
  ` : css`
    border-radius: ${appearanceStyle === 'top_double' ? `${borderRadius.toUnit()} ${borderRadius.toUnit()} 0 0` : `0 0 ${borderRadius.toUnit()} ${borderRadius.toUnit()}`};
  `};

  &:hover {
    padding: 1px 6px 1px 8px;
    border-style: solid;
    border-width: 1px;
  }

  & > ${StyledTabCloseButton} {
    display: flex;
    border-radius: ${borderRadius.toUnit()};
  }

  ${({ active = false, pinned = false, themeColor }) => {
    const color = themeColor ? Color(themeColor).alpha(.3) : undefined;

    if (pinned) {
      return active ? css`
        padding: 5px 7px;
        ${color && css`
          background-color: ${color.string()};
          border-color: ${color.string()};
        `};
        border-style: solid;
        border-width: 2px;

        &:hover {
          padding: 5px 7px;
          ${color && css`border-color: ${color.string()};`};
          border-style: solid;
          border-width: 2px;
        }

        & > ${StyledTabCloseButton} {
          display: none;
        }
      ` : css`
        padding: 5px 7px;
        border-style: solid;
        border-width: 2px;

        &:hover {
          padding: 6px 8px;
          border-style: solid;
          border-width: 1px;
        }

        & > ${StyledTabCloseButton} {
          display: none;
        }
      `;
    }

    return active && css`
      padding: 0 5px 0 7px;
      ${color && css`
        background-color: ${color.string()};
        border-color: ${color.string()};
      `};
      border-style: solid;
      border-width: 2px;

      &:hover {
        padding: 0 5px 0 7px;
        ${color && css`border-color: ${color.string()};`};
        border-style: solid;
        border-width: 2px;
      }
    `;
  }};
`;

interface StyledVerticalTabProps extends StyledTabProps {
    extended: boolean;
}

export const StyledVerticalTab = styled.div<StyledVerticalTabProps>`
  width: 100%;
  height: 34px;
  margin: 0;
  padding: ${({ extended }) => extended ? '3px 7px' : '3px'};
  display: flex;
  place-content: center;
  place-items: center;
  flex-shrink: 0;
  gap: 5px;
  user-select: none;
  outline-width: 2px;
  border-style: solid;
  border-width: 2px;
  border-radius: ${borderRadius.toUnit()};
  app-region: no-drag;

  &:hover {
    padding: ${({ extended }) => extended ? '4px 8px' : '4px'};
    border-style: solid;
    border-width: 1px;

    & > ${StyledTabIcon}, & > ${StyledTabProgress}, & > .MuiSvgIcon-root {
      display: ${({ pinned, extended }) => pinned || extended ? 'flex' : 'none'};
    }

    & > ${StyledTabCloseButton} {
      display: flex;
    }
  }

  & > ${StyledTabIcon}, & > ${StyledTabProgress}, & > .MuiSvgIcon-root {
    display: flex;
  }

  & > ${StyledTabCloseButton} {
    display: ${({ extended }) => extended ? 'flex' : 'none'};
    border-radius: 50%;
  }

  ${({ active = false, pinned = false, themeColor, extended }) => {
    const color = themeColor ? Color(themeColor).alpha(.3) : undefined;

    if (pinned) {
      return active ? css`
        padding: ${extended ? '3px 7px' : '3px'};
        ${color && css`
          background-color: ${color.string()};
          border-color: ${color.string()};
        `};
        border-style: solid;
        border-width: 2px;

        &:hover {
          padding: ${extended ? '3px 7px' : '3px'};
          ${color && css`border-color: ${color.string()};`};
          border-style: solid;
          border-width: 2px;
        }

        & > ${StyledTabCloseButton} {
          display: none;
        }
      ` : css`
        padding: ${extended ? '3px 7px' : '3px'};
        border-style: solid;
        border-width: 2px;

        &:hover {
          padding: ${extended ? '4px 8px' : '4px'};
          border-style: solid;
          border-width: 1px;
        }

        & > ${StyledTabCloseButton} {
          display: none;
        }
      `;
    }

    return active && css`
      padding: ${extended ? '3px 7px' : '3px'};
      ${color && css`
        background-color: ${color.string()};
        border-color: ${color.string()};
      `};
      border-style: solid;
      border-width: 2px;

      &:hover {
        padding: ${extended ? '3px 7px' : '3px'};
        ${color && css`border-color: ${color.string()}`};
        border-style: solid;
        border-width: 2px;
      }

      & > ${StyledTabIcon}, & > ${StyledTabProgress}, & > .MuiSvgIcon-root {
        display: ${extended ? 'flex' : 'none'};
      }

      & > ${StyledTabCloseButton} {
        display: flex;
      }
    `;
  }};
`;
