import styled from 'styled-components';
import { borderRadius } from '../../../../../themes';

export const StyledPanel = styled.div`
  width: 100%;
  margin: 0;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  // gap: 4px;
  border-radius: ${borderRadius.toUnit()};
  overflow: hidden;
  user-select: none;
`;

interface StyledItemProps {
    selected: boolean;
}

export const StyledItem = styled.div<StyledItemProps>`
  width: 100%;
  height: 36px;
  margin: 0;
  padding: 4px 12px;
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  gap: 12px;
`;

export const StyledItemIcon = styled.div`
  width: 20px;
  height: 20px;
  margin: 0;
  padding: 0;
  display: flex;
  place-content: center;
  place-items: center;
`;

export const StyledItemLabel = styled.span`
  width: 100%;
  display: block;
  flex-shrink: 0;
  font-size: 13px;
  white-space: nowrap;
`;
