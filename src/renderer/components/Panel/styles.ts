import { platform } from 'os';
import styled, { css } from 'styled-components';
import { borderRadius } from '../../themes';
import { PanelType } from './index';

interface StyledProps {
    type: PanelType;
}

export const StyledPanel = styled.div<StyledProps>`
  width: 100%;
  height: 100%;
  grid-area: panel;
  display: grid;
  grid-template-rows: ${({ type }) => type === 'popup' ? '50px' : '60px'} 1fr;
  grid-template-areas:
    'header'
    'content';
  border-radius: ${({ type }) => type === 'popup' ? borderRadius.value : 0}px;
  overflow: hidden;
  user-select: none;
`;

export const StyledPanelHeader = styled.header<StyledProps>`
  width: 100%;
  height: 100%;
  padding: 8px 12px;
  grid-area: header;
  display: flex;
  align-items: center;
  gap: 4px;

  ${({ type }) => type === 'popup' && css`
    border-bottom-style: solid;
    border-bottom-width: 1px;
  `};
`;

export const StyledPanelTitle = styled.h3`
  margin: 0;
  font-weight: ${platform() !== 'darwin' ? 400 : 300};
`;

export const StyledPanelButton = styled.button`
  aspect-ratio: 1;
  height: 100%;
  max-height: 36px;
  margin: 0 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s ease-out;
  outline-width: 2px;
  border-style: solid;
  border-width: 1px;
  border-radius: ${borderRadius.toUnit()};
  user-select: none;
`;

export const StyledPanelContainer = styled.div`
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
