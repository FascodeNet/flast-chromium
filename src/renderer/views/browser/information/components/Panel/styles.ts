import styled, { css } from 'styled-components';
import { borderRadius } from '../../../../../themes';

export const StyledItem = styled.div`
  width: 100%;
  height: 40px;
  padding: 8px 12px;
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  transition: all .2s ease-out;
    // border-radius: ${borderRadius.toUnit()};
`;

export const StyledCertificateStatus = styled(StyledItem)`
  height: unset;
  align-items: flex-start;
`;

interface StyledItemIconProps {
    favicon?: string;
}

export const StyledItemIcon = styled.div<StyledItemIconProps>`
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  display: flex;
  place-content: center;
  place-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  ${({ favicon }) => favicon && css`
    background-image: url('${favicon}');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  `};

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const StyledItemLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
`;

export const StyledItemLabel = styled.span`
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledItemSubLabel = styled.h6`
  margin: 0;
  padding: 0;
  font-size: 12px;
  font-weight: normal;
`;

export const StyledItemDescription = styled.div`
  font-size: 11px;
`;

export const StyledItemDate = styled.span`
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

