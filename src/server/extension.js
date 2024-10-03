const path = require('path');
const { buildComponentTree } = require('./parser.js');
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const disposable = vscode.commands.registerCommand('reactive2.makeComponentTree', async () => {
		const options = {
			canSelectMany: false,
			openLabel: 'Select topmost parent component',
			filters: {
				'Accepted Files': ['js', 'jsx', 'ts', 'tsx']
			}
		};

		const fileUri = await vscode.window.showOpenDialog(options);
		if (fileUri && fileUri[0]) {
			const filePath = fileUri[0].fsPath;
			const baseDir = path.dirname(filePath);
			const tree = buildComponentTree(filePath, baseDir);

			// Display the React Component Tree in output channel
			const outputChannel = vscode.window.createOutputChannel('React Component Tree');
			outputChannel.appendLine(`Component Tree: ${JSON.stringify(tree, null, 2)}`);
			outputChannel.show();
		}
	});

	context.subscriptions.push(disposable);

	const webview = vscode.commands.registerCommand('reactive2.renderReact', () => {
		const panel = vscode.window.createWebviewPanel('webviewTest', 'React', vscode.ViewColumn.One, {
			enableScripts: true
		});

		const scriptSrc = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'index.js'));

		panel.webview.html = `
			<!DOCTYPE html>
			<html lang="en">
				<head></head>
				<body>
					<noscript>You need to enable JavaScript to run this app.</noscript>
					<div id="root"></div>
					<script src="${scriptSrc}"></script>
				</body>
			</html>`;
	});

	context.subscriptions.push(webview);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};

// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// // Note: we are requiring the vscode library 