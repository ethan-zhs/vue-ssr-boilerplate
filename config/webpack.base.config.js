const path = require('path')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    devtool: isDev
        ? 'cheap-module-eval-source-map'
        : 'source-map',

    mode: isProd ? 'production' : 'development',

    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js'
    },

    resolve: {
        alias: {
            Components: path.resolve(__dirname, '../src/view/components'),
            Utils: path.resolve(__dirname, '../src/view/utils'),
            Stores: path.resolve(__dirname, '../src/view/store'),
            Statics: path.resolve(__dirname, '../src/view/statics')
        }
    },

    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [
        {
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            include: [resolve('src'), resolve('test')],
            options: {
                formatter: require('eslint-friendly-formatter')
            }
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                cssModules: {
                    localIdentName: '[name]-[local]-[hash:base64:5]',
                    camelCase: true
                },
                extractCSS: !isDev,
                preserveWhitespace: false,
                postcss: [
                    require('autoprefixer')({
                        browsers: [
                            "> 1%",
                            "last 5 versions",
                            "not ie <= 8",
                            "Android >= 4",
                            "UCAndroid >= 9",
                            "iOS >= 8"
                        ]
                    })
                ]
            }
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [
                path.join(__dirname, '../src')
            ]
        },
        {
            test: /\.(jpe?g|png|gif|ico|woff|woff2|eot|ttf|svg|swf)$/,
            loader: 'url-loader',
                options: {
                limit: 1,
                name: 'client/images/[name][hash:8].[ext]'
            }
        }]
    },
    performance: {
        maxEntrypointSize: 300000,
        hints: !isDev ? 'warning' : false
    },
    plugins: isDev ? [
        new FriendlyErrorsPlugin()
    ] : []
}
