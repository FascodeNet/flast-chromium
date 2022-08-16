import { platform } from 'os';
import styled from 'styled-components';
import { borderRadius } from '../../themes';

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
  min-width: 16px;
  height: 16px;
  min-height: 16px;
  background-image: ${({ favicon }) => favicon ? `url('${favicon}')` : 'unset'};
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`;

export const StyledBookmarkItemIcon = styled.div`
  width: 16px;
  min-width: 16px;
  height: 16px;
  min-height: 16px;
  display: flex;
  place-items: center;

  & svg {
    width: 100%;
    height: 100%;
  }
`;

export const StyledBookmarkItemLabel = styled.span`
  font-size: 12px;
  font-weight: ${platform() !== 'darwin' ? 400 : 300};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

