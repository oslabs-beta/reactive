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
        library: {
            type: 'commonjs2'
        }
    },
    externals: {
        vscode: 'commonjs vscode'
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    optimization: {
        minimize: false
    },
    plugins: [
        new (require('webpack')).BannerPlugin({ 
            banner: 'const vscode = require("vscode");\n',
            raw: true,
            entryOnly: true
        })
    ]
}
];