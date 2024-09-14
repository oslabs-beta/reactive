/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./extension.js":
/*!**********************!*\
  !*** ./extension.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("// The module 'vscode' contains the VS Code extensibility API\n// Import the module and reference it with the alias vscode in your code below\n// Note: we are requiring the vscode library \nconst vscode = __webpack_require__(Object(function webpackMissingModule() { var e = new Error(\"Cannot find module 'vscode'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\n\n// This method is called when your extension is activated\n// Your extension is activated the very first time the command is executed\n\n/**\n * @param {vscode.ExtensionContext} context\n */\nfunction activate(context) {\n  // Use the console to output diagnostic information (console.log) and errors (console.error)\n  // This line of code will only be executed once when your extension is activated\n  console.log('Congratulations, your extension \"reactive2\" is now active!');\n\n  // The command has been defined in the package.json file\n  // Now provide the implementation of the command with  registerCommand\n  // The commandId parameter must match the command field in package.json\n  const disposable = vscode.commands.registerCommand('reactive2.helloWorld', function () {\n    // The code you place here will be executed every time your command is executed\n    console.log('testing commands from the extensions file');\n    // Display a message box to the user\n    vscode.window.showInformationMessage('Hello World from Reactive2! Hello World command executed');\n  });\n  context.subscriptions.push(disposable);\n  const disposable2 = vscode.commands.registerCommand('reactive2.makeComponentTree', function () {\n    const nestedComponentTree = {\n      \"Parent\": {\n        \"Child\": {\n          \"Functional\": false,\n          \"Class\": true\n        },\n        \"Functional\": true,\n        \"Class\": false\n      }\n    };\n    console.log('tree done on this extension', JSON.stringify(nestedComponentTree, null, 2));\n\n    // Display the nestedComponentTree in an output window / channel\n    const outputChannel = vscode.window.createOutputChannel('nested Component Tree');\n    outputChannel.appendLine(JSON.stringify(nestedComponentTree, null, 2));\n    outputChannel.show();\n    vscode.window.showInformationMessage('nestedComponentTree displayed in the output channel');\n  });\n  context.subscriptions.push(disposable2);\n  const webview = vscode.commands.registerCommand('reactive2.renderReact', function () {\n    const seedData = {\n      \"Parent\": {\n        \"Child\": {\n          \"Functional\": false,\n          \"Class\": true\n        },\n        \"Functional\": true,\n        \"Class\": false\n      }\n    };\n    let panel = vscode.window.createWebviewPanel(\"webviewTest\", \"React\", vscode.ViewColumn.One, {\n      enableScripts: true\n    });\n    let scriptSrc = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, \"index.js\"));\n    panel.webview.html = `<!DOCTYPE html>\n        <html lang=\"en\">\n          <head>\n          </head>\n          <body>\n            <noscript>You need to enable JavaScript to run this app.</noscript>\n            <div id=\"root\"></div>\n            <script src=\"${scriptSrc}\"></script>\n          </body>\n        </html>\n        `;\n  });\n  context.subscriptions.push(webview);\n}\n\n// This method is called when your extension is deactivated\nfunction deactivate() {}\nmodule.exports = {\n  activate,\n  deactivate\n};\n\n//# sourceURL=webpack://reactive2/./extension.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./extension.js");
/******/ 	
/******/ })()
;