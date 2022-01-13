import styled, { css } from 'styled-components';
import { borderRadius } from '../../themes';

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


export const StyledBookmarkItem = styled.div`
  width: 100%;
  height: 30px;
  padding: 4px 7px;
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
  transition: all .2s ease-out;
  border-radius: ${borderRadius.toUnit()};
`;

interface StyledBookmarkItemFaviconProps {
    favicon?: string;
}

export const StyledBookmarkItemFavicon = styled.div<StyledBookmarkItemFaviconProps>`
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

export const StyledBookmarkItemLabel = styled.span`
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledBookmarkItemDate = styled.span`
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

