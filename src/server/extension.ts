import { DisposableOptions, TreeObject } from "../types";

const path = require ('path') 
// from parser.js
const { buildComponentTree } = require('./parser');
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// Note: we are requiring the vscode library 
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

const activate = (context: vscode.ExtensionContext): void => {
	let disposable = vscode.commands.registerCommand('reactive2.makeComponentTree', async () => {
	  const options: DisposableOptions = {
		canSelectMany: false,
		openLabel: 'Select topmost parent component',
		filters: {
		  'Accepted Files': ['js', 'jsx', 'ts', 'tsx']
		}
	  };
	  const fileUri = await vscode.window.showOpenDialog(options);
	  if (fileUri && fileUri[0]) {
		const filePath: string = fileUri[0].fsPath;
		const baseDir: string = path.dirname(filePath);
		const tree: TreeObject = buildComponentTree(filePath, baseDir);
		vscode.window.showInformationMessage(`Component Tree: ${JSON.stringify(tree, null, 2)}`);


		// Display the React Component Tree in output channel / migrating to webViewPanel
		const outputChannel = vscode.window.createOutputChannel('React Component Tree');
		outputChannel.appendLine(`Component Tree: ${JSON.stringify(tree, null, 2)}`);
		outputChannel.show();	
	  }
	});

context.subscriptions.push(disposable);
//}

// function activate(context) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "reactive2" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with  registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('reactive2.helloWorld', function () {
// 		// The code you place here will be executed every time your command is executed
// 		console.log('testing commands from the extensions file')
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from Reactive2! Hello World command executed');
// 	});
// 	context.subscriptions.push(disposable);

// 	// parses using parser.js
// 	const disposable2 = vscode.commands.registerCommand('reactive2.makeComponentTree', function () {
// 		// output of parser.js
// 		const nestedComponentTree = 
// 			console.log('test output of parser.js')

// 			// Display the React Component Tree in output channel / migrating to webViewPanel
// 			const outputChannel = vscode.window.createOutputChannel('React Component Tree');
// 			outputChannel.appendLine();
// 			outputChannel.show();			

// 			vscode.window.showInformationMessage('React Component Tree displayed in the output channel');
// 		});
		
	//context.subscriptions.push(disposable2);

	// const webview = vscode.commands.registerCommand('reactive2.renderReact', function () {
	// 	const seedData = {
	// 		"Parent": {
	// 			"Child": {
	// 				"Functional": false,
	// 				"Class": true,
	// 			},
	// 			"Functional": true,
	// 			"Class": false,
					
	// 			}
	// 		}
	// 	let panel = vscode.window.createWebviewPanel("webviewTest", "React", vscode.ViewColumn.One, {
    //         enableScripts: true
    //     })

	// 	let scriptSrc = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "index.js"))

	// 	panel.webview.html = `<!DOCTYPE html>
    //     <html lang="en">
    //       <head>
    //       </head>
    //       <body>
    //         <noscript>You need to enable JavaScript to run this app.</noscript>
    //         <div id="root"></div>
    //         <script src="${scriptSrc}"></script>
    //       </body>
    //     </html>
    //     `
	// })
	// context.subscriptions.push(webview);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
