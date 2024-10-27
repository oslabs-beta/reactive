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
  const renderReact = vscode.commands.registerCommand('reactive2.renderReact', async () => {
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

      panel.webview.postMessage({ type: 'testMessage', payload: 'Hello from extension!' });

      panel.webview.onDidReceiveMessage(
        async message => {
          //console.log("message type: " + message.type) // this logs
          if(message.type === 'onData'){
            console.log("message value: " + message.value); // this logs
            context.workspaceState.update('renderReact', message.value)
            panel.webview.postMessage(tree).then(console.log("posted: " + tree)); //{type: 'astData', payload: message.value, settings: vscode.workspace.getConfiguration('renderReact')}
          }
        }, undefined, context.subscriptions)
      
      panel.webview.html = getWebviewContent(webviewJsUri, treeObj);
      });
    context.subscriptions.push(renderReact);
  }

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
        <h1>Sup Fellas!</h1>
        <div id="root"></div>
          <div id="dendrogram"></div>
          <script src="https://d3js.org/d3.v7.min.js"></script>
          <script>
            const vscode = acquireVsCodeApi();
            window.onload = () => {
              vscode.postMessage({
                type: 'onData',
                value: ${obj}
              })
            }
          </script>
          <script src=${uri}></script>
      </body>
      </html>
    `);
  }
    // Register all the commands to the context, so VSCode can activate them
  
  

// Deactivate the extension
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
//   // Path to the webview's JavaScript file
//   const webviewJsPath = vscode.Uri.file(path.join(context.extensionPath, 'dist', 'webview.js'));
//   const webviewJsUri = panel.webview.asWebviewUri(webviewJsPath);

//   // HTML content for the webview
//   panel.webview.html = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>React Component Tree</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           margin: 0;
//           padding: 0;
//         }
//       </style>
//     </head>
//     <body>
//       <h1>Sup Handsome Fellas!</h1>
//       <h2 id="dendro">Tree</h2>
//       <div id="root"></div>
//       <script src="${webviewJsUri}"></script>
//       <script>
//         const dendro = document.getElementById('dendro');
//         dendro.textContent = ${dendrogram(treeAST)}
//       </script>
//     </body>
//     </html>
//   `;
// });
