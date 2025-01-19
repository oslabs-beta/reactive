const path = require('path');

module.exports = [
  {
    name: 'extension',
    mode: 'production',  
    target: 'node',
    entry: './out/server/extension.js',
    output: {
      path: path.resolve(__dirname, 'out/server'), 
      filename: 'extension.js',
      libraryTarget: 'commonjs2',
      clean: true
    },
    externals: {
      vscode: 'commonjs vscode',
    },
    resolve: {
      extensions: ['.js', '.ts'],
    },
    optimization: {
      minimize: true  
    }
  },
  {
    name: 'webview',
    mode: 'production',
    target: 'web',
    entry: './src/webview/index.js',
    output: {
      path: path.resolve(__dirname, 'out/webview'),  
      filename: 'webview.js',
      clean: false
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
      ],
    },
    optimization: {
      minimize: true  
    }
  },
];