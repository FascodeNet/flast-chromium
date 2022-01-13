import styled, { css } from 'styled-components';
import { borderRadius } from '../../themes';

export const StyledExtensionItem = styled.div`
  width: 100%;
  height: 40px;
  padding: 4px 8px;
  display: grid;
  grid-template-columns: 24px 1fr 30px;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
  transition: all .2s ease-out;
  border-radius: ${borderRadius.toUnit()};
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
