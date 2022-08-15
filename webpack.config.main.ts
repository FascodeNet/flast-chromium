import { Configuration } from 'webpack';
import { Main as MainConfig, Preload as PreloadConfig } from './webpack.config';

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

export default [Main, Preload];
