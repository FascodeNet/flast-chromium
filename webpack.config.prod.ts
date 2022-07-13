import { Configuration } from 'webpack';
import {
    applyBrowserEntries,
    applyPageEntries,
    BrowserRenderer as BrowserRendererConfig,
    Main as MainConfig,
    PageRenderer as PageRendererConfig,
    Preload as PreloadConfig
} from './webpack.config';

const Main: Configuration = {
    ...MainConfig,
    mode: 'production',
    stats: 'errors-only',
    performance: { hints: false },
    optimization: { minimize: true },
    devtool: undefined
};

const Preload: Configuration = {
    ...PreloadConfig,
    mode: 'production',
    stats: 'errors-only',
    performance: { hints: false },
    optimization: { minimize: true },
    devtool: undefined
};

const BrowserRenderer: Configuration = {
    ...BrowserRendererConfig,
    mode: 'production',
    stats: 'errors-only',
    performance: { hints: false },
    optimization: { minimize: true },
    devtool: undefined
};

const PageRenderer: Configuration = {
    ...PageRendererConfig,
    mode: 'production',
    stats: 'errors-only',
    performance: { hints: false },
    optimization: { minimize: true },
    devtool: undefined
};

applyBrowserEntries(
    BrowserRenderer,
    [
        'app',
        'process-manager',

        'menu',
        'information',
        'search',
        'find',
        'bookmarks',
        'histories',
        'downloads',
        'extensions'
    ]
);

applyPageEntries(
    PageRenderer,
    [
        'settings'
    ]
);

export default [Main, Preload, BrowserRenderer, PageRenderer];
