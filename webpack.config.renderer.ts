import { Configuration } from 'webpack';
import {
    applyBrowserEntries,
    applyPageEntries,
    BrowserRenderer as BrowserRendererConfig,
    PageRenderer as PageRendererConfig
} from './webpack.config';

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
        'history',
        'downloads',
        'extensions'
    ]
);

applyPageEntries(
    PageRenderer,
    [
        'home',
        'bookmarks',
        'history',
        'downloads',
        'applications',
        'settings'
    ]
);

export default [BrowserRenderer, PageRenderer];
