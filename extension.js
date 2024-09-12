// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// Note: we are requiring the vscode library 
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "reactive2" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('reactive2.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		console.log('testing commands from the extensions file')
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Reactive2! Hello World command executed');
	});
	context.subscriptions.push(disposable);

	const disposable2 = vscode.commands.registerCommand('reactive2.makeComponentTree', function () {
		const nestedComponentTree = {
			"Parent": {
				"Child": {
					"Functional": false,
					"Class": true,
				},
				"Functional": true,
				"Class": false,
					
				}
			}
			console.log('tree done on this extension', JSON.stringify(nestedComponentTree, null, 2));

			// Display the nestedComponentTree in an output window / channel
			const outputChannel = vscode.window.createOutputChannel('nested Component Tree');
			outputChannel.appendLine(JSON.stringify(nestedComponentTree, null, 2));
			outputChannel.show();			

			vscode.window.showInformationMessage('nestedComponentTree displayed in the output channel');
		});
		
	context.subscriptions.push(disposable2);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
