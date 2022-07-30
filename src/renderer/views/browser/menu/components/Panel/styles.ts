import styled, { css } from 'styled-components';
import { borderRadius } from '../../../../../themes';

export const StyledPanel = styled.div`
  width: 100%;
  height: 100%;
  grid-area: panel;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-areas: 'content';
  border-radius: ${borderRadius.toUnit()};
  overflow: hidden;
  user-select: none;
`;

export const StyledPanelContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px 0;
  grid-area: content;
  display: flex;
  flex-direction: column;
  align-items: center;
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

export const StyledItem = styled.div`
  width: 100%;
  height: 30px;
  padding: 4px 12px;
  display: grid;
  grid-template-columns: 20px 1fr 40px 20px;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  transition: all .2s ease-out;
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
  min-width: 20px;
  height: 20px;
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
  margin: 0;
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

