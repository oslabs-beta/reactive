const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { buildComponentTree } = require('./parser.js');

// let treeObj = {
//   tree: {}
// };
let treeObj;
let tree = {}

// Activate the extension, setting up command listeners
function activate(context) {
  
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
      //console.log(tree)
    }
    
      const panel = vscode.window.createWebviewPanel(
        'dendrogram',
        `Component Tree Built From ${appName}`,               // Title of the webview panel
        vscode.ViewColumn.One,     // Column to show the webview in
        {
          enableScripts: true,     // Allow JavaScript execution in the webview
          localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'dist'))]
        }
      );

      const dendrogramPath = path.join(
        context.extensionPath,
        'src',
        'webview',
        'Dendrogram.jsx'
      );

      const dendrogramJS = fs.readFileSync(dendrogramPath, 'utf8');
      
      panel.webview.html = getWebviewContent(dendrogramJS);

      panel.webview.onDidReceiveMessage(
        message => {
          if(message.type === 'webviewReady'){
            panel.webview.postMessage({ type: 'testMessage', payload: 'Hello from extension!' });
            panel.webview.postMessage({type: 'astData', payload: tree});
          }
        },
        undefined,
        context.subscriptions
      );
      

      function getWebviewContent(dendrogramJS) {
        return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Component Tree</title>
          </head>
          <body>
            <h1>Sup Fellas!</h1>
            <h2 id = 'test'>This should change</h2>
              <div id="dendrogram"></div>
              <script src="https://d3js.org/d3.v7.min.js"></script>
              <script>
                  const vscode = acquireVsCodeApi();
                  ${dendrogramJS}
              </script>
          </body>
          </html>`;
    }
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

  // Register all the commands to the context, so VSCode can activate them
  })
  context.subscriptions.push(renderReact);
}

// Deactivate the extension
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
