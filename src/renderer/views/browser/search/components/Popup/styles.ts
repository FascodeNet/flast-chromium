import styled from 'styled-components';

export const StyledContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  place-content: center;
  place-items: center;
  position: absolute;
  gap: 16px;

  @media (min-width: 700px) {
    width: 600px;
    top: 150px;
  }
`;
