import { createTheme, PaletteColor, useTheme } from '@mui/material';
import { blue, green, indigo, orange, pink, red } from '@mui/material/colors';
import { PaletteOptions } from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import { createGlobalStyle } from 'styled-components';

export const MuiPalette: PaletteOptions = {
    primary: {
        light: indigo[300],
        main: indigo[500],
        dark: indigo[700]
    },
    secondary: {
        light: pink.A200,
        main: pink.A400,
        dark: pink.A700
    },
    error: {
        light: red[300],
        main: red[500],
        dark: red[700]
    },
    warning: {
        light: orange[300],
        main: orange[500],
        dark: orange[700]
    },
    info: {
        light: blue[300],
        main: blue[500],
        dark: blue[700]
    },
    success: {
        light: green[300],
        main: green[500],
        dark: green[700]
    },

    outline: {
        light: '#000',
        main: '#000',
        dark: '#fff'
    },
    titleBar: {
        light: '#f2f3f5',
        main: '#f2f3f5',
        dark: '#121212'
    },
    addressBar: {
        light: '#fff',
        main: '#fff',
        dark: '#242424'
    },
    tab: {
        light: '#fff',
        main: '#fff',
        dark: '#242424'
    },
    tabBorder: {
        light: '#d2d3d5',
        main: '#d2d3d5',
        dark: '#424242'
    },
    addTabButton: {
        light: '#fff',
        main: '#fff',
        dark: '#242424'
    }
};

export const MuiTypography: TypographyOptions = {
    fontFamily: '\'Roboto Symbol\', \'Noto Sans\', \'Noto Sans JP\', \'Yu Gothic UI\', \'Hiragino Sans\', \'Noto Color Emoji\', sans-serif'
};

export const MuiLightGlobalStyles = createTheme({
    palette: {
        ...MuiPalette,
        mode: 'light'
    },
    typography: MuiTypography
});

export const MuiDarkGlobalStyles = createTheme({
    palette: {
        ...MuiPalette,
        mode: 'dark'
    },
    typography: MuiTypography
});


export const getColor = (palette: PaletteColor) => {
    const theme = useTheme();
    return theme.palette.mode === 'light' ? palette.light : palette.dark;
};

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    font-family: 'Roboto Symbol', 'Noto Sans', 'Noto Sans JP', 'Yu Gothic UI', 'Hiragino Sans', 'Noto Color Emoji', sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
    color: ${({ theme }) => theme.palette.text.primary};
    font-size: .9375rem;
    font-weight: 400;
    line-height: 1.5;
    overflow: hidden;
  }
  
  body > div#app {
    width: 100vw;
    height: 100vh;
  }
  
  browser-action-list {
    display: flex;
    align-items: center;
    app-region: no-drag;
  }

  ::selection {
    background: #b3d4fc;
    text-shadow: none;
  }
`;
