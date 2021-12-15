import styled from 'styled-components';

export const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 0 2px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.mode === 'light' ? '#fff' : '#181818'};
`;
