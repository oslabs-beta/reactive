import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
const { buildComponentTree } = require('./parser.js');
import { DisposableOptions, FiltersObject, TreeObject } from '../types';

function activate(context: vscode.ExtensionContext) {
  console.log('Reactive TypeScript extension actived');
  const renderReact = vscode.commands.registerCommand('reactive.renderReact', async () => {
    const options: DisposableOptions = {
      canSelectMany: false,
      openLabel: 'Select React Component',
      filters: {
        'React Components': ['jsx', 'tsx']
      }
    };

    try {
      const fileUri = await vscode.window.showOpenDialog(options);
      if (fileUri && fileUri[0]) {
        const filePath = fileUri[0].fsPath;
        const baseDir = path.dirname(filePath);
        const compName = path.parse(filePath).base;

        const tree: TreeObject = buildComponentTree(filePath, baseDir);
        console.log('Component Tree Data:', JSON.stringify(tree, null, 2));
        const treeObj = JSON.stringify(tree, null, 2);

        const panel = vscode.window.createWebviewPanel(
          'dendrogram',
          `Component Tree Built From ${compName}`,
          vscode.ViewColumn.One,
          {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'out'))]
          }
        );

        const webviewJsPath = vscode.Uri.file(
          path.join(context.extensionPath, 'out/webview', 'webview.js')
        );
        const webviewJsUri = panel.webview.asWebviewUri(webviewJsPath);

        console.log(`Loading Webview for ${compName}`);
        panel.webview.html = getWebviewContent(compName, webviewJsUri, treeObj);

        panel.webview.onDidReceiveMessage(async (message) => {
          if (message.type === 'onData') {
            console.log(`Received message: ${message.value}`);
            context.workspaceState.update('renderReact', message.value);
            panel.webview.postMessage({
              type: 'astData',
              payload: {
                treeData: message.value,
                filePath: filePath
              },
              settings: vscode.workspace.getConfiguration('renderReact')
            }).then(() => console.log("Posted astData with filePath"));
          }
        }, undefined, context.subscriptions);
      }
    } catch (error) {
      console.error('Error during command execution:', error);
      vscode.window.showErrorMessage('An error occurred while executing the command.');
    }
  });

  context.subscriptions.push(renderReact);

  function getWebviewContent(compName: string, uri: vscode.Uri, obj: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta compName="viewport" content="width=device-width, initial-scale=1.0">
          <title>Component Tree: ${compName}</title>
      </head>
      <body>
        <div id="root"></div>
        <script src="https://d3js.org/d3.v7.min.js"></script>
        <script>
          const vscode = acquireVsCodeApi();
          window.onload = () => {
            vscode.postMessage({
              type: 'onData',
              value: ${obj},
              compName: '${compName}'
            });
          };
        </script>
        <script src="${uri}"></script>
      </body>
      </html>
    `;
  }
}

function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
