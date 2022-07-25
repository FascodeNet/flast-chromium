import { Button, styled as muiStyled } from '@mui/material';
import { alpha } from '@mui/system';
import styled from 'styled-components';

export const StyledDrawer = styled.div`
  width: 100%;
  height: 100%;
  padding: 3rem 2rem;
  display: none;
  border-right: solid 1px ${({ theme }) => theme.palette.divider};

  @media screen and (min-width: 900px) {
    grid-area: navigation-drawer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
`;

export const StyledTitle = styled.h1`
  width: 100%;
  margin: 0 0 8px;
  align-self: flex-start;
  font-weight: 200;
  user-select: none;
`;

interface ButtonProps {
    active?: boolean;
}

export const StyledButton = muiStyled(
    Button,
    {
        shouldForwardProp: (prop) => prop !== 'active'
    }
)<ButtonProps>(({ theme, active }) => ({
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontWeight: active ? 400 : 300,
    color: active ? theme.palette.primary.main : 'inherit',
    backgroundColor: active ? alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity) : 'inherit',
    '&:hover': {
        backgroundColor: active ? alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity) : alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity)
    },
    '& .MuiButton-startIcon': {
        marginLeft: 0,
        color: active ? theme.palette.primary.main : theme.palette.action.active
    }
}));
