import styled, { css } from 'styled-components';
import { borderRadius } from '../../../../themes';

export const StyledSidebarContent = styled.div`
  width: 100%;
  height: 100%;
  grid-area: panel;
  display: grid;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    'header'
    'content';
  overflow: hidden;
  user-select: none;
`;

export const StyledSidebarHeader = styled.header`
  width: 100%;
  height: 100%;
  padding: 8px 12px;
  grid-area: header;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const StyledSidebarTitle = styled.h3`
  margin: 0;
`;

export const StyledSidebarContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  grid-area: content;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    border: solid 2px transparent;
    border-right: solid 3px transparent;
  }

  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 10px 10px #bbb;
    border: solid 2px transparent;
    border-right: solid 3px transparent;
    border-radius: 9px;
  }

  &::-webkit-scrollbar-thumb:hover, ::-webkit-scrollbar-thumb:active {
    box-shadow: inset 0 0 10px 10px #aaa;
  }
`;

export const StyledHistoryGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  h4 {
    margin: 0;
    padding: 4px 7px;
    align-self: flex-start;
  }
`;


export const StyledHistoryItem = styled.div`
  width: 100%;
  height: 30px;
  padding: 4px 7px;
  display: grid;
  grid-template-columns: 20px 1fr 30px;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
  transition: all .2s ease-out;
  border-radius: ${borderRadius.toUnit()};
`;

interface StyledHistoryItemFaviconProps {
    favicon?: string;
}

export const StyledHistoryItemFavicon = styled.div<StyledHistoryItemFaviconProps>`
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  ${({ favicon }) => favicon && css`
    background-image: url('${favicon}');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  `}
`;

export const StyledHistoryItemLabel = styled.span`
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledHistoryItemDate = styled.span`
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

