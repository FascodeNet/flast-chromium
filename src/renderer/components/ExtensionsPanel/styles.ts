import styled, { css } from 'styled-components';
import { borderRadius } from '../../themes';

export const StyledExtensionItem = styled.div`
  width: 100%;
  height: 40px;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 40px;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
  transition: all .2s ease-out;
  border-radius: ${borderRadius.toUnit()};
`;

export const StyledExtensionItemContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 4px 8px;
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
  transition: all .2s ease-out;
`;

interface StyledExtensionItemIconProps {
    icon?: string;
}

export const StyledExtensionItemIcon = styled.div<StyledExtensionItemIconProps>`
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  ${({ icon }) => icon && css`
    background-image: url('${icon.replaceAll(/\\/g, '\\\\')}');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  `}
`;

export const StyledExtensionItemLabel = styled.span`
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledExtensionItemMenuButton = styled.button`
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  display: flex;
  place-content: center;
  place-items: center;
  border-top-right-radius: ${borderRadius.toUnit()};
  border-bottom-right-radius: ${borderRadius.toUnit()};
`;
