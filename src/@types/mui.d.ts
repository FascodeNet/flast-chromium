import { PaletteColor, PaletteColorOptions } from '@mui/material';
import { PaletteOptions as MuiPaletteOptions } from '@mui/material/styles';

interface CustomPaletteColor extends PaletteColor {
    incognito: string;
}

type CustomPaletteColorOptions = PaletteColorOptions & { incognito: string; }

declare module '@mui/material/styles' {

    interface Palette {
        outline: CustomPaletteColor;
        titleBar: CustomPaletteColor;
        addressBar: CustomPaletteColor;
        tab: CustomPaletteColor;
        tabBorder: CustomPaletteColor;
        addTabButton: CustomPaletteColor;
    }

    interface PaletteOptions extends MuiPaletteOptions {
        outline: CustomPaletteColorOptions;
        titleBar: CustomPaletteColorOptions;
        addressBar: CustomPaletteColorOptions;
        tab: CustomPaletteColorOptions;
        tabBorder: CustomPaletteColorOptions;
        addTabButton: CustomPaletteColorOptions;
    }
}
