const path = require('path');

module.exports = {
    entry: {
        background: './app/scripts/background.ts',
        display: './app/scripts/display.ts',
        options: './app/scripts/options.ts',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'app/dist'),
    },
};
