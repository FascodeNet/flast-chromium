import { PaletteColor, PaletteColorOptions } from '@mui/material';
import { PaletteOptions as MuiPaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        outline: PaletteColor;
        titleBar: PaletteColor;
        addressBar: PaletteColor;
        tab: PaletteColor;
        tabBorder: PaletteColor;
        addTabButton: PaletteColor;
    }

    interface PaletteOptions extends MuiPaletteOptions {
        outline: PaletteColorOptions;
        titleBar: PaletteColorOptions;
        addressBar: PaletteColorOptions;
        tab: PaletteColorOptions;
        tabBorder: PaletteColorOptions;
        addTabButton: PaletteColorOptions;
    }
}
