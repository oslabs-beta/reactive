const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { buildComponentTree } = require('./parser.js');

// Activate the extension, setting up command listeners
function activate(context) {
  let treeObj;
  let tree;
  /**
   * Render the React application in a Webview.
   * This function creates a new Webview panel and displays an HTML page
   * that loads a React app script from the extension's dist folder.
   */
  const renderReact = vscode.commands.registerCommand('reactive.renderReact', async () => {
    let appName = ""
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
      appName = path.parse(filePath).base;
      tree = buildComponentTree(filePath, baseDir);
      treeObj = JSON.stringify(tree, null, 2)
    }
    
      const panel = vscode.window.createWebviewPanel(
        'dendrogram',
        `Component Tree Built From ${appName}`,               // Title of the webview panel
        vscode.ViewColumn.One,     // Column to show the webview in
        {
          enableScripts: true,     // Allow JavaScript execution in the webview
          localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'dist'))],
          retainContextWhenHidden: true,
        }
      );
      const webviewJsPath = vscode.Uri.file(path.join(context.extensionPath, 'dist', 'webview.js'));
      const webviewJsUri = panel.webview.asWebviewUri(webviewJsPath);

      panel.webview.postMessage({ type: 'testMessage', payload: 'Hello from extension!' }).then(console.log("posted test")); //this logs

      panel.webview.onDidReceiveMessage(
        async message => {
          //console.log("message type: " + message.type) // this logs
          if(message.type === 'onData'){
            console.log("message value: " + message.value); // this logs
            context.workspaceState.update('renderReact', message.value)
            panel.webview.postMessage({type: 'astData', payload: message.value, settings: vscode.workspace.getConfiguration('renderReact')}).then(console.log("posted actual")); //this logs, which I believe only works if the message contents are valid. otherwise, may need to use this instead of 'tree' -> 
          }
        }, undefined, context.subscriptions)
      
      panel.webview.html = getWebviewContent(webviewJsUri, treeObj);
      });
    context.subscriptions.push(renderReact);
  }
  /**
   * Display the React component tree in the Output channel.
   * Prompts the user to select a file, builds the component tree, and displays it in the VSCode Output panel.
   */
  const makeComponentTree = vscode.commands.registerCommand('reactive.makeComponentTree', async () => {
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

      // Create a new output channel to display the tree
      const outputChannel = vscode.window.createOutputChannel('React Component Tree');
      outputChannel.appendLine(`Component Tree: ${JSON.stringify(tree, null, 2)}`);
      outputChannel.show();
    }
  });

  function getWebviewContent(uri, obj) {
    return (`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Component Tree</title>
      </head>
      <body>
        <h1>Reactive</h1>
        <div id="root"></div>
          <div id="dendrogram"></div>
          
            <script src="https://d3js.org/d3.v7.min.js"></script>

            <script>
              const vscode = acquireVsCodeApi();
              window.onload = () => {
                vscode.postMessage({
                  type: 'onData',
                  value: ${obj}
                });
              };
          </script>

          <script src=${uri}></script>

      </body>
      </html>
    `);
  }

// Deactivate the extension
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
