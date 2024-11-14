/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./out/server/extension.js":
/*!*********************************!*\
  !*** ./out/server/extension.js ***!
  \*********************************/
/***/ (() => {

eval("\n// import { DisposableOptions, TreeObject } from \"../types\";\n// const path = require ('path') \n// // from parser.js\n// const { buildComponentTree } = require('./parser');\n// // The module 'vscode' contains the VS Code extensibility API\n// // Import the module and reference it with the alias vscode in your code below\n// // Note: we are requiring the vscode library \n// const vscode = require('vscode');\n// // This method is called when your extension is activated\n// // Your extension is activated the very first time the command is executed\n// /**\n//  * @param {vscode.ExtensionContext} context\n//  */\n// const activate = (context: vscode.ExtensionContext): void => {\n// \tlet disposable = vscode.commands.registerCommand('reactive2.makeComponentTree', async () => {\n// \t  const options: DisposableOptions = {\n// \t\tcanSelectMany: false,\n// \t\topenLabel: 'Select topmost parent component',\n// \t\tfilters: {\n// \t\t  'Accepted Files': ['js', 'jsx', 'ts', 'tsx']\n// \t\t}\n// \t  };\n// \t  const fileUri = await vscode.window.showOpenDialog(options);\n// \t  if (fileUri && fileUri[0]) {\n// \t\tconst filePath: string = fileUri[0].fsPath;\n// \t\tconst baseDir: string = path.dirname(filePath);\n// \t\tconst tree: TreeObject = buildComponentTree(filePath, baseDir);\n// \t\tvscode.window.showInformationMessage(`Component Tree: ${JSON.stringify(tree, null, 2)}`);\n// \t\t// Display the React Component Tree in output channel / migrating to webViewPanel\n// \t\tconst outputChannel = vscode.window.createOutputChannel('React Component Tree');\n// \t\toutputChannel.appendLine(`Component Tree: ${JSON.stringify(tree, null, 2)}`);\n// \t\toutputChannel.show();\t\n// \t  }\n// \t});\n// context.subscriptions.push(disposable);\n// //}\n// // function activate(context) {\n// // \t// Use the console to output diagnostic information (console.log) and errors (console.error)\n// // \t// This line of code will only be executed once when your extension is activated\n// // \tconsole.log('Congratulations, your extension \"reactive2\" is now active!');\n// // \t// The command has been defined in the package.json file\n// // \t// Now provide the implementation of the command with  registerCommand\n// // \t// The commandId parameter must match the command field in package.json\n// // \tconst disposable = vscode.commands.registerCommand('reactive2.helloWorld', function () {\n// // \t\t// The code you place here will be executed every time your command is executed\n// // \t\tconsole.log('testing commands from the extensions file')\n// // \t\t// Display a message box to the user\n// // \t\tvscode.window.showInformationMessage('Hello World from Reactive2! Hello World command executed');\n// // \t});\n// // \tcontext.subscriptions.push(disposable);\n// // \t// parses using parser.js\n// // \tconst disposable2 = vscode.commands.registerCommand('reactive2.makeComponentTree', function () {\n// // \t\t// output of parser.js\n// // \t\tconst nestedComponentTree = \n// // \t\t\tconsole.log('test output of parser.js')\n// // \t\t\t// Display the React Component Tree in output channel / migrating to webViewPanel\n// // \t\t\tconst outputChannel = vscode.window.createOutputChannel('React Component Tree');\n// // \t\t\toutputChannel.appendLine();\n// // \t\t\toutputChannel.show();\t\t\t\n// // \t\t\tvscode.window.showInformationMessage('React Component Tree displayed in the output channel');\n// // \t\t});\n// \t//context.subscriptions.push(disposable2);\n// \t// const webview = vscode.commands.registerCommand('reactive2.renderReact', function () {\n// \t// \tconst seedData = {\n// \t// \t\t\"Parent\": {\n// \t// \t\t\t\"Child\": {\n// \t// \t\t\t\t\"Functional\": false,\n// \t// \t\t\t\t\"Class\": true,\n// \t// \t\t\t},\n// \t// \t\t\t\"Functional\": true,\n// \t// \t\t\t\"Class\": false,\n// \t// \t\t\t}\n// \t// \t\t}\n// \t// \tlet panel = vscode.window.createWebviewPanel(\"webviewTest\", \"React\", vscode.ViewColumn.One, {\n//     //         enableScripts: true\n//     //     })\n// \t// \tlet scriptSrc = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, \"index.js\"))\n// \t// \tpanel.webview.html = `<!DOCTYPE html>\n//     //     <html lang=\"en\">\n//     //       <head>\n//     //       </head>\n//     //       <body>\n//     //         <noscript>You need to enable JavaScript to run this app.</noscript>\n//     //         <div id=\"root\"></div>\n//     //         <script src=\"${scriptSrc}\"></script>\n//     //       </body>\n//     //     </html>\n//     //     `\n// \t// })\n// \t// context.subscriptions.push(webview);\n// }\n// // This method is called when your extension is deactivated\n// function deactivate() {}\n// module.exports = {\n// \tactivate,\n// \tdeactivate\n// }\n//# sourceMappingURL=extension.js.map\n\n//# sourceURL=webpack://reactive/./out/server/extension.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./out/server/extension.js"]();
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;