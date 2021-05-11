const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  entry: './src/parser.js',
  output: {
    path: path.join(__dirname, './build'),
    filename: '[name].js',
    library: 'RegexperLib',
    libraryTarget: 'umd',
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: require.resolve('snapsvg'),
        loader: 'imports-loader',
        options: {
          wrapper: 'window',
          additionalCode: 'module.exports = 0;'
        }
      },
      {
        test: /\.peg$/,
        loader: require.resolve('./lib/canopy-loader')
      }
    ]
  }
};
