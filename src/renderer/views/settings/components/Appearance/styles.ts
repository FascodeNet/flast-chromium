import { ButtonBase, Theme } from '@mui/material';
import { styled as muiStyled } from '@mui/styles';
import styled from 'styled-components';

interface StyledSelectProps {
    image: string;
}

export const StyledStyleSelectButton = muiStyled(ButtonBase)(({ theme }: { theme: Theme }) => ({
    position: 'relative',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    border: `solid 1px ${theme.palette.divider}`,
    borderRadius: 4
}));

export const StyledStyleSelect = styled.div<StyledSelectProps>`
  width: 300px;
  height: 190px;
  background-image: url('${({ image }) => image}');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

export const StyledStyleDetail = styled.div`
  width: 100%;
  position: absolute;
  bottom: 3px;
  left: 3px;
  display: flex;
  align-items: center;
`;
