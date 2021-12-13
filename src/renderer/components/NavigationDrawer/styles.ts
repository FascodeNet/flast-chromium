import { Button } from '@mui/material';
import { styled as muiStyled } from '@mui/styles';
import styled from 'styled-components';

export const StyledDrawer = styled.div`
  width: 100%;
  height: 100%;
  padding: 3rem 2rem;
  grid-area: navigation-drawer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-right: solid 1px ${({ theme }) => theme.palette.divider};
`;

export const StyledTitle = styled.h1`
  width: 100%;
  margin: 0 0 8px;
  align-self: flex-start;
  font-weight: 200;
  user-select: none;
`;

export const StyledButton = muiStyled(Button)({
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontWeight: 300,
    '& .MuiButton-startIcon': {
        marginLeft: 0
    },
    '&.MuiButton-textPrimary': {
        fontWeight: 400
    }
});
