const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./base.js');
const NgTools = require('@ngtools/webpack');
const utils = require('./utils.js');

module.exports = function() {

    let config = {};
    config.module = { rules: [] };
    config.mode = 'development';
    // ==================================================================================

    config.output = commonConfig().output;
    config.output.publicPath = "http://localhost:8079/"; //  "http://localhost:8079/";

    // ==================================================================================
    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     * test: inline-source-map
     * dev: eval-source-map, cheap-module-eval-source-map, eval
     * prod: source-map
     */
    config.devtool = 'cheap-module-eval-source-map'; // cheap-module-eval-source-map


    // ==================================================================================
    /**
     * Loaders
     * https://webpack.js.org/loaders/
     */

    // sass loader
    config.module.rules.push({
        test: /\.scss$/,
        use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }],
        include: [
            path.resolve(__dirname, '../src/assets/css')
        ],
        exclude: /node_modules/
    });

     // AOT loader
     config.module.rules.push({
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: '@ngtools/webpack',
        include: [path.resolve(__dirname, '../src/app')]
    })


    // ==================================================================================
    /**
     * Plugins definition
     */
    config.plugins = [
        new webpack.HotModuleReplacementPlugin(),
        new NgTools.AngularCompilerPlugin({
            tsConfigPath: path.resolve(__dirname, '../tsconfig.json'),
            entryModule: path.resolve(__dirname, '../src/app/app.module#AppModule')
        })
    ];

    // ==================================================================================
    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        hot: true,
        contentBase: './dist',
        stats: 'minimal',
        host: 'localhost',
        port: '8079',
        disableHostCheck: true,
        historyApiFallback: true
    };

    let common = commonConfig();
    utils.removeTsLoaders(common);

    return webpackMerge(common, config);
};

