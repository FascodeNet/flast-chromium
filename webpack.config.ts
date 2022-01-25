import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import { Configuration } from 'webpack';
import { APPLICATION_NAME } from './src/utils';

export const getBrowserHtml = (name: string) => new HtmlWebpackPlugin({
    title: APPLICATION_NAME,
    template: './static/index.html',
    filename: `${name}.html`,
    chunks: [name],
    scriptLoading: 'blocking',
    inject: 'body',
    minify: false
});

export const getPageHtml = (name: string) => new HtmlWebpackPlugin({
    title: APPLICATION_NAME,
    template: './static/index.html',
    filename: `${name}.html`,
    chunks: [name],
    scriptLoading: 'blocking',
    inject: 'body',
    minify: false
});

export const applyBrowserEntries = (config: any, entries: string[]) => {
    for (const entry of entries) {
        config.entry[entry] = `./src/renderer/views/browser/${entry}`;
        config.plugins.push(getBrowserHtml(entry));
    }
};

export const applyPageEntries = (config: any, entries: string[]) => {
    for (const entry of entries) {
        config.entry[entry] = `./src/renderer/views/${entry}`;
        config.plugins.push(getPageHtml(entry));
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
        path: resolve(__dirname, 'build'),
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
        view: './src/preloads/view.ts',
        dialog: './src/preloads/dialog.ts'
    }
};

export const BrowserRenderer: Configuration = {
    ...BaseConfig,
    output: {
        ...BaseConfig.output,
        path: resolve(__dirname, 'build', 'browser')
    },
    mode: 'development',
    target: 'web',
    entry: {},
    plugins: [new MiniCssExtractPlugin()]
};

export const PageRenderer: Configuration = {
    ...BaseConfig,
    mode: 'development',
    target: 'web',
    entry: {},
    plugins: [new MiniCssExtractPlugin()]
};

applyBrowserEntries(
    BrowserRenderer,
    [
        'app',
        'process-manager',
        'find',
        'histories',
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
