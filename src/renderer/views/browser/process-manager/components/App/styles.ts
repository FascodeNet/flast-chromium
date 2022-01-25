import styled from 'styled-components';

export const StyledApp = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 40px calc(100% - 40px);
  color: ${({ theme }) => theme.palette.text.primary};
`;
