const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './extension.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
        options: {
            presets: ['@babel/env', '@babel/react'],
          },
      },
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
      },
  },
//   plugins: [
//     new HtmlWebPackPlugin({
//       template: './src/index.html',
//       filename: './index.html',
//     }),
    // new CopyPlugin({
    //   patterns: [{ from: './src/style.css' }],
    // }),
//   ]
};