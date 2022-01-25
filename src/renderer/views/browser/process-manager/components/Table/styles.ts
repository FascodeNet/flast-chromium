import styled from 'styled-components';

export const StyledTable = styled.table`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 60px 1fr;
  grid-template-columns: 1fr;
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

export const StyledTableRow = styled.tr`
  width: 100%;
  height: 30px;
  display: grid;
  grid-template-columns: 2fr 100px 100px 100px;
  user-select: none;
`;

export const StyledTableRowHead = styled.th`
  height: inherit;
  padding: 3px 8px;
  display: flex;
  align-items: flex-end;
  text-align: start;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-right: solid 1px ${({ theme }) => theme.palette.divider};

  &:not(:first-child) {
    justify-self: flex-end;
  }
`;

export const StyledTableRowData = styled.td`
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-self: flex-end;
  border-right: solid 1px ${({ theme }) => theme.palette.divider};
`;

export const StyledTableHead = styled.thead`
  width: 100%;
  height: 60px;
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.palette.mode === 'light' ? '#fff' : '#181818'};
  border-bottom: solid 1px ${({ theme }) => theme.palette.divider};
  user-select: none;

  & ${StyledTableRow} {
    height: inherit;
    align-items: flex-end;
  }
`;

export const StyledTableBody = styled.tbody`
  padding-bottom: 5px;
`;

export const StyledTableSectionRow = styled.tr`
  width: 100%;
  height: 40px;
  display: grid;
  align-items: center;
  grid-template-columns: 2fr 100px 100px 100px;
  user-select: none;
`;

export const StyledTableSectionRowHead = styled.th`
  height: inherit;
  padding: 3px 8px;
  display: flex;
  align-items: center;
  text-align: start;
  border-right: solid 1px ${({ theme }) => theme.palette.divider};

  & h3 {
    margin: 0;
    color: #3f51b5;
  }
`;

export const StyledTableSectionRowData = styled.td`
  height: inherit;
  padding: 3px 8px;
  display: flex;
  align-items: center;
  justify-self: flex-end;
  border-right: solid 1px ${({ theme }) => theme.palette.divider};
`;
