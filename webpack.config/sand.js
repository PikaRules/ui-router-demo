const path = require('path');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./base.js');
const NgTools = require('@ngtools/webpack');
const utils = require('./utils.js');

module.exports = function() {

    let config = {};
    config.module = { rules: [] };
    config.mode = 'development';
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

    config.plugins = [
        new NgTools.AngularCompilerPlugin({
            tsConfigPath: path.resolve(__dirname, '../tsconfig.json'),
            entryModule: path.resolve(__dirname, '../src/app/app.module#AppModule')
        })
    ];

    let common = commonConfig();
    utils.removeTsLoaders(common);

    return webpackMerge(common, config);
};

