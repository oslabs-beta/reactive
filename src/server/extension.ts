import * as vscode from 'vscode';

// Try to force error visibility
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    vscode.window.showErrorMessage(`Uncaught Exception: ${error}`);
});

// Force synchronous console log at module load
try {
    console.log('Module loading - START');
    vscode.window.showErrorMessage('Module loading');
} catch (e) {
    console.error('Error in top-level code:', e);
}

function activate(context: vscode.ExtensionContext) {
    try {
        console.log('Activate starting');

        let disposable = vscode.commands.registerCommand('reactive.renderReact', async () => {
            try {
                const options = {
                    canSelectMany: false,
                    openLabel: 'Select React Component',
                    filters: {
                        'React Components': ['jsx', 'tsx']
                    }
                };

                const fileUri = await vscode.window.showOpenDialog(options);
                if (fileUri && fileUri[0]) {
                    vscode.window.showInformationMessage(`Selected file: ${fileUri[0].fsPath}`);
                }
            } catch (e) {
                console.error('Command execution error:', e);
                vscode.window.showErrorMessage(`Error: ${e}`);
            }
        });

        context.subscriptions.push(disposable);
        console.log('Command registered');
    } catch (e) {
        console.error('Activation error:', e);
        vscode.window.showErrorMessage(`Activation error: ${e}`);
        throw e;
    }
}

exports.activate = activate;
exports.deactivate = () => {};