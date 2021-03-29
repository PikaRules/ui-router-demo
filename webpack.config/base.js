const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BumpFilePlugin = require('./custom.plugins/bump-file-plugin');
const jsonfile = require('jsonfile');

module.exports = function() {

    let jsonPackage = jsonfile.readFileSync('./package.json');
    let version = jsonPackage.version;
    const vendorCss = new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash].css",
        allChunks: true
    });

    let config = {};
    config.module = { rules: [] };

    config.entry = {
        app: './src/main.aot.ts'
    };
    config.output = {
        filename: '[name].bundle.js' + '?v=' + version,
        chunkFilename: '[name].bundle.js'+ '?v=' + version,
        path: path.resolve(__dirname, '../dist'),
        publicPath: "./"
    };
    config.target = "web";

    // ==================================================================================
    /**
     * Loaders
     * https://webpack.js.org/loaders/
     */

    // ng-annotate with babel
    config.module.rules.push({
        test: /\.js$/,
        exclude: [/app\/vendor/, /node_modules/],
        use: [{
            loader: 'babel-loader',
            options: {
                presets: [
                    ["@babel/preset-env", {"loose": true}]
                ],
                plugins: ["@babel/plugin-syntax-dynamic-import"],
                comments: false
            },
        }]
    });

    // template loader
    config.module.rules.push({
        test: /\.(html|css)$/,
        include: [path.resolve(__dirname, '../src/app')],
        loader: 'raw-loader',
        options: {
            esModule: false,
        },
        exclude: /\.async\.(html|css)$/
    });

    // typescript loader module
    config.module.rules.push({
        test: /\.ts$/,
        use: [
            {
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: path.resolve(__dirname, '../tsconfig.json'),
                    useCache: false,
                    compilerOptions: {
                        noImplicitUseStrict: true
                    }
                }
            },
            {
                loader: 'angular2-template-loader'
            }],
        include: [path.resolve(__dirname, '../main.ts'), path.resolve(__dirname, '../src/app')],
        exclude: [/node_modules/, /\.(spec|e2e)\.ts$/]
    });

    // tslint loader
    config.module.rules.push({
        test: /\.ts$/,
        enforce: 'pre',
        use: [
            {
                loader: 'tslint-loader',
                options: {
                    configFile: path.resolve(__dirname, '../tslint.json'),
                    emitErrors: true
                }
            }
        ],
         include: [path.resolve(__dirname, '../src/app')]
    });

    // we don't need this because url-loader will run file-loader if images are bigger than limit
    // static files
    /*
    config.module.rules.push({
        test: /\.(jpg|png|gif|svg)$/,
        use: {
            loader: 'file-loader',
            options: {
                limit: 1000,
                outputPath: 'img/',
                name: '[name].[ext]'
            }
        }
    });*/


    // url loader
    config.module.rules.push({
        test: /\.(jpg|png|gif|svg)$/i,
        use: {
            loader: 'url-loader',
            options: {
                limit: 1000,
                outputPath: 'img/',
                name: '[name].[ext]'
            }
        }
    });

    config.module.rules.push({
        test: /\.(woff|woff2|eot|ttf)$/,
        use: {
            loader: 'url-loader',
            options: {
                limit: 1000,
                outputPath: 'fonts/'
            }
        }
    });

    // vendor css

    // TODO: Maybe include postcss later,
    // this kind of plugins could be very usefull https://flaviocopes.com/postcss/#autoprefixer
    // question: does sass do something like this: 'autoprefixer'?

    // vendor css
    config.module.rules.push({
        test: /\.css$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: '../'
                }
            },
            'css-loader',
            "sass-loader"
        ],
        include: [path.resolve(__dirname, '../vendor')],
        exclude: /node_modules/
    });

    config.resolve = {
        alias: {
            environment: path.resolve(__dirname, '../environments/environment.js' ),
            konvaCustom: path.resolve(__dirname, '../vendor/konva/konva.min.js'),
            identicon: path.resolve(__dirname, '../node_modules/identicon.js/identicon.js')
        },
        extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
        modules: [path.resolve(__dirname, '../src/'), path.resolve(__dirname, '../node_modules'), path.resolve(__dirname, '../vendor/angular-material')]
    };

    // ======== optimizaion ===============

    config.optimization = {
        splitChunks: {
            maxAsyncRequests: Infinity,
            cacheGroups: {
                default: {
                    chunks: 'async',
                    minChunks: 1,
                    priority: 10
                },
                common: {
                    name: 'async.common',
                    chunks: 'async',
                    minChunks: 2,
                    enforce: true,
                    priority: 5
                },
                vendors: false,
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    enforce: true,
                    test (moduleContext, chunks) {
                        if ( !moduleContext ) { return false; }
                        let keywords = ['node_modules', 'vendor'];
                        for (let index = 0, length = keywords.length; index < length; index++ ) {
                            if ( moduleContext.context && moduleContext.context.indexOf(keywords[index]) !== -1 ) {
                                return true;
                            }
                        }
                        return false;
                    }
                }
            }
        },
        runtimeChunk: "single" // Webpack runtime
    }

    // ==================================================================================
    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    /*
    if (isTest) {
        config.devtool = 'inline-source-map';
    }
    else if (isProd) {
        config.devtool = 'source-map';
    }
    else {
        config.devtool = 'eval-source-map';
    }
    */


    // ==================================================================================
    /**
     * Plugins definition
     */
    config.plugins = [
        vendorCss,
        new webpack.ContextReplacementPlugin( /(.+)?angular(\\|\/)core(.+)?/, path.resolve(__dirname, '../src'), {} ),
        new webpack.DefinePlugin({
            'process.env.BUILD_ENV': "'" + process.env.BUILD_ENV + "'" || "'development'",
            'process.env.APP_ENV': "'" + process.env.APP_ENV + "'" || "'development'",
            'process.env.API_HOST': "'" + process.env.API_HOST + "'" || "''",
            'process.env.API_BASE': "'" + process.env.API_BASE + "'" || "''",
            'process.env.DEBUG': process.env.DEBUG || false,
            'process.env.TEST': process.env.TEST || false,
            'process.env.appVersion': "'" + version + "'"
        }),
        new HtmlWebpackPlugin({
            version: version,
            title: 'SPLYZA Teams',
            template: './src/index.ejs', // ejs template
        }),
        new CleanWebpackPlugin(['dist', 'build'], {
            root: path.resolve(__dirname, '../'),
            verbose: false,
            dry: false,
            exclude: []
        }),
        new CopyWebpackPlugin([
            { from:  path.resolve(__dirname, '../src/assets/img/**/*.*'), to:  path.resolve(__dirname, '../dist/img'), flatten: true },
            { from:  path.resolve(__dirname, '../src/assets/locale/**/*.*'), to:  path.resolve(__dirname, '../dist/locale'), flatten: true },
            { from:  path.resolve(__dirname, '../src/assets/json/**/*.json'), to:  path.resolve(__dirname, '../dist/json'), flatten: true }
        ]),
        new BumpFilePlugin({
            data: { version: version, appname: 'SPLYZA Teams', builtDate: new Date().toISOString() },
            filename: "version.json"
        })
        // , new webpack.ProvidePlugin({ echarts: 'echarts' })
    ];

    return config;
};

