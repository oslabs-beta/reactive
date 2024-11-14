const path = require('path');

module.exports = [
  {
    name: 'extension',
    mode: 'production',  // Changed to production
    target: 'node',
    entry: './out/server/extension.js',
    output: {
      path: path.resolve(__dirname, 'out'),  // Changed from 'dist' to 'out'
      filename: 'extension.js',
      libraryTarget: 'commonjs2',
      clean: true
    },
    externals: {
      vscode: 'commonjs vscode',
      // Add external dependencies that shouldn't be bundled
      '@babel/parser': 'commonjs @babel/parser',
      '@babel/traverse': 'commonjs @babel/traverse'
    },
    resolve: {
      extensions: ['.js', '.ts'],
    },
    optimization: {
      minimize: true  // Enable minimization for production
    }
  },
  {
    name: 'webview',
    mode: 'production',  // Changed to production
    target: 'web',
    entry: './src/webview/index.js',
    output: {
      path: path.resolve(__dirname, 'out/webview'),  // Changed path to out/webview
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
      minimize: true  // Enable minimization for production
    }
  },
];