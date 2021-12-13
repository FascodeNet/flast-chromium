import { Configuration } from 'webpack';
import {
    applyEntries,
    Main as MainConfig,
    Preload as PreloadConfig,
    Renderer as RendererConfig
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

const Renderer: Configuration = {
    ...RendererConfig,
    mode: 'production',
    stats: 'errors-only',
    performance: { hints: false },
    optimization: { minimize: true },
    devtool: undefined
};

applyEntries(Renderer, ['app', 'process-manager', 'settings']);

export default [Main, Preload, Renderer];
