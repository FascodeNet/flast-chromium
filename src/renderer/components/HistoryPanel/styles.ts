import styled, { css } from 'styled-components';
import { borderRadius } from '../../themes';

export const StyledHistoryGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  h4 {
    width: inherit;
    margin: 0;
    padding: 4px 8px;
    position: sticky;
    top: -9px;
    align-self: flex-start;
    font-weight: 400;
  }
`;


export const StyledHistoryItem = styled.div`
  width: 100%;
  height: 30px;
  padding: 4px 7px;
  display: grid;
  grid-template-columns: 20px 1fr 32px;
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
  min-width: 16px;
  height: 16px;
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

