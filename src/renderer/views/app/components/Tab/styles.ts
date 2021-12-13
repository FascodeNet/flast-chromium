import Color from 'color';
import styled, { css } from 'styled-components';
import { getColor } from '../../../../themes';
import { TAB_MAX_WIDTH, TAB_PINNED_WIDTH } from '../../../../utils/tab';

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
  height: 16px;
  min-width: 16px;
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
  color: ${({ theme }) => theme.palette.text.primary};
  outline-color: ${({ theme }) => getColor(theme.palette.outline)};
  outline-width: 2px;
  background-color: transparent;
  border: solid 1px transparent;
  border-radius: 50%;

  & svg {
    width: 12px;
    height: 12px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
    border: solid 1px ${({ theme }) => theme.palette.divider};
  }
`;

interface StyledTabProps {
    active?: boolean;
    pinned?: boolean;
    themeColor?: string;
}

export const StyledHorizontalTab = styled.div<StyledTabProps>`
  // width: clamp(72px, 100%, 250px);
    // min-width: ${TAB_PINNED_WIDTH}px;
  max-width: ${TAB_MAX_WIDTH}px;
  height: 100%;
  padding: 0 5px 0 7px;
  /*
  position: absolute;
  left: 0;
  */
  display: flex;
  align-self: center;
  align-content: center;
  align-items: center;
  gap: 5px;
  user-select: none;
  outline-color: ${({ theme }) => getColor(theme.palette.outline)};
  outline-width: 2px;
  background-color: ${({ theme }) => getColor(theme.palette.tab)};
  border: solid 2px ${({ theme }) => getColor(theme.palette.tab)};
  border-radius: 8px;
  app-region: no-drag;

  &:hover {
    padding: 1px 6px 1px 8px;
    border: solid 1px ${({ theme }) => getColor(theme.palette.tabBorder)};

    & > ${StyledTabCloseButton} {
      display: flex;
    }
  }

  & > ${StyledTabCloseButton} {
    display: none;
  }

  ${({ active = false, pinned = false, themeColor = undefined, theme }) => {
    const color = themeColor ? Color(themeColor).alpha(.3) : Color(theme.palette.action.hover);

    if (pinned) {
      return active ? css`
        padding: 5px 7px;
        background-color: ${color.string()};
        border: solid 2px ${color.string()};

        &:hover {
          padding: 5px 7px;
          border: solid 2px ${color.string()};
        }
      ` : css`
        padding: 5px 7px;
        background-color: ${getColor(theme.palette.tab)};
        border: solid 2px ${getColor(theme.palette.tab)};

        &:hover {
          padding: 6px 8px;
          border: solid 1px #d2d3d5;
        }
      `;
    }

    return active && css`
      padding: 0 5px 0 7px;
      background-color: ${color.string()};
      border: solid 2px ${color.string()};

      &:hover {
        padding: 0 5px 0 7px;
        border: solid 2px ${color.string()};
      }

      & > ${StyledTabCloseButton} {
        display: flex;
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
  /*
  position: absolute;
  left: 0;
  */
  display: flex;
  place-content: center;
  place-items: center;
  flex-shrink: 0;
  gap: 5px;
  user-select: none;
  outline-color: ${({ theme }) => getColor(theme.palette.outline)};
  outline-width: 2px;
  background-color: ${({ theme }) => getColor(theme.palette.tab)};
  border: solid 2px ${({ theme }) => getColor(theme.palette.tab)};
  border-radius: 8px;
  app-region: no-drag;
  
  &:hover {
    padding: ${({ extended }) => extended ? '4px 8px' : '4px'};
    border: solid 1px ${({ theme }) => getColor(theme.palette.tabBorder)};

    & > ${StyledTabIcon}, & > ${StyledTabProgress}, & > .MuiSvgIcon-root {
      display: ${({ extended }) => extended ? 'flex' : 'none'};
    }

    & > ${StyledTabCloseButton} {
      display: flex;
    }
  }

  & > ${StyledTabIcon}, & > ${StyledTabProgress}, & > .MuiSvgIcon-root {
    display: flex;
  }

  & > ${StyledTabCloseButton} {
    display: none;
  }

  ${({ active = false, pinned = false, themeColor = undefined, extended, theme }) => {
    const color = themeColor ? Color(themeColor).alpha(.3) : Color(theme.palette.action.hover);

    if (pinned) {
      return active ? css`
        padding: ${extended ? '3px 7px' : '3px'};
        background-color: ${color.string()};
        border: solid 2px ${color.string()};

        &:hover {
          padding: ${extended ? '3px 7px' : '3px'};
          border: solid 2px ${color.string()};
        }
      ` : css`
        padding: ${extended ? '3px 7px' : '3px'};
        background-color: ${getColor(theme.palette.tab)};
        border: solid 2px ${getColor(theme.palette.tab)};

        &:hover {
          padding: ${extended ? '4px 8px' : '4px'};
          border: solid 1px #d2d3d5;
        }
      `;
    }

    return active && css`
      padding: ${extended ? '3px 7px' : '3px'};
      background-color: ${color.string()};
      border: solid 2px ${color.string()};

      &:hover {
        padding: ${extended ? '3px 7px' : '3px'};
        border: solid 2px ${color.string()};
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
