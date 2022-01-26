import styled from 'styled-components';
import { borderRadius } from '../../../../../themes';

export const StyledPanel = styled.div`
  width: 100%;
  max-width: 900px;
  min-height: 300px;
  margin: 0;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 0 12px 16px rgba(0, 0, 0, .12), 0 8px 10px rgba(0, 0, 0, .16);
  overflow: hidden;
  user-select: none;

  @media (min-width: 700px) {
    border-radius: ${borderRadius.toUnit()};
  }
`;

interface StyledItemProps {
    selected: boolean;
}

export const StyledItem = styled.div<StyledItemProps>`
  width: 100%;
  height: 40px;
  margin: 0;
  padding: 4px 16px;
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  gap: 12px;
`;

export const StyledItemIcon = styled.div`
  width: 24px;
  height: 24px;
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
