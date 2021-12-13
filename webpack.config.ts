import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import { APPLICATION_NAME } from './src/utils';

export const getHtml = (name: string) => new HtmlWebpackPlugin({
    title: APPLICATION_NAME,
    template: './static/index.html',
    filename: `${name}.html`,
    chunks: [name],
    scriptLoading: 'blocking',
    inject: 'body',
    minify: false
});

export const applyEntries = (config: any, entries: string[]) => {
    for (const entry of entries) {
        config.entry[entry] = `./src/renderer/views/${entry}`;
        config.plugins.push(getHtml(entry));
    }
};


export const BaseConfig: Configuration = {
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: './',
        filename: '[name].js',
        assetModuleFilename: 'assets/[name][ext]'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{ loader: 'ts-loader' }]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    }
                ]
            },
            {
                test: /\.(bmp|ico|gif|jpe?g|png|svg|ttf|eot|woff?2?)$/,
                type: 'asset/resource'
            }
        ]
    },
    externals: {
        keytar: `require('keytar')`,
        electron: 'require("electron")',
        fs: 'require("fs")',
        os: 'require("os")',
        path: 'require("path")'
    },
    devtool: 'inline-source-map'
};

export const Main: Configuration = {
    ...BaseConfig,
    mode: 'development',
    target: 'electron-main',
    entry: {
        main: './src/main/main.ts'
    }
};

export const Preload: Configuration = {
    ...BaseConfig,
    mode: 'development',
    target: 'electron-preload',
    entry: {
        window: './src/preloads/window.ts',
        view: './src/preloads/view.ts'
    }
};

export const Renderer: Configuration = {
    ...BaseConfig,
    mode: 'development',
    target: 'web',
    entry: {},
    plugins: [new MiniCssExtractPlugin()]
};

applyEntries(Renderer, ['app', 'process-manager', 'settings']);

export default [Main, Preload, Renderer];
