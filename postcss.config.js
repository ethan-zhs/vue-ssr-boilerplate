module.exports = {
    plugins: {
        'postcss-import': {},
        'autoprefixer': {
            browsers: [
                "> 1%",
                "last 5 versions",
                "not ie <= 8",
                "ios >= 8",
                "android >= 4.0"
            ]
        }
    }
}