/*
VSCODE EXTENSION: REACTIVE COMPONENT VISUALIZER
============================================

CORE FUNCTIONALITY:
-----------------
1. File Selection → Parse Path → Extract App Name → Build Tree → Render Visualization

FILE HANDLING FLOW:
-----------------
Input: User selects React component file
Output: Interactive visualization of component hierarchy

Example Path Processing:
"/Users/project/src/components/MyApp.tsx"
↓ path.parse(filePath)
{
  root: '/',
  dir: '/Users/project/src/components',
  base: 'MyApp.tsx',    // Currently used for appName
  name: 'MyApp',        // Could use this to avoid extension
  ext: '.tsx'
}

MESSAGE FLOW:
-----------
Extension → Webview → React Components
1. Initial load: Sends tree data (TODO with app name)
2. Webview processes: Updates visualization
3. React renders: Shows component hierarchy
*/

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { buildComponentTree } = require('./parser.js');

function activate(context) {
  // Register command that builds and displays the component tree
  const renderReact = vscode.commands.registerCommand('reactive.renderReact', async () => {
    // Configure file picker to only allow React component files
    const options = {
      canSelectMany: false,
      openLabel: 'Select React Component (.jsx or .tsx)',
      filters: {
        'React Components': ['jsx', 'tsx']  // Limiting to React component files
      }
    };

    // Handle file selection
    const fileUri = await vscode.window.showOpenDialog(options);
    if (fileUri && fileUri[0]) {
      const filePath = fileUri[0].fsPath;
      const baseDir = path.dirname(filePath);
      const appName = path.parse(filePath).base;  // Get filename with extension
      
      // Generate component tree and convert to string
      const tree = buildComponentTree(filePath, baseDir);
      const treeObj = JSON.stringify(tree, null, 2);

      // Create webview panel for visualization
      const panel = vscode.window.createWebviewPanel(
        'dendrogram',
        `Component Tree Built From ${appName}`,  // Panel title shows app name
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'dist'))]
        }
      );

      // Set up webview resources
      const webviewJsPath = vscode.Uri.file(
        path.join(context.extensionPath, 'dist', 'webview.js')
      );
      const webviewJsUri = panel.webview.asWebviewUri(webviewJsPath);

      // Log webview creation
      console.log(`Loading Webview for ${appName}`);
      
      // Generate and set webview HTML content
      panel.webview.html = getWebviewContent(appName, webviewJsUri, treeObj);

      // Handle messages from webview
      panel.webview.onDidReceiveMessage(async (message) => {
        console.log("Received message: ", message); // Debug logging
        
        if (message.type === 'onData') {
          console.log(`Received message: ${message.value}`);
          
          // Update workspace state
          context.workspaceState.update('renderReact', message.value);
          
          // Send data back to webview
          panel.webview.postMessage({
            type: 'astData',
            payload: { 
              treeData: message.value, 
              filePath: filePath  // Include file path for reference
            },
            settings: vscode.workspace.getConfiguration('renderReact')
          }).then(() => console.log("Posted astData with filePath"));
        }
      }, undefined, context.subscriptions);
    }
  });

  context.subscriptions.push(renderReact);

  // Generate HTML content for webview
  function getWebviewContent(name, uri, obj) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Component Tree: ${name}</title>
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
              appName: '${name}'  // Pass app name to React components
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

module.exports = {
  activate,
  deactivate, 
};

/*
DATA FLOW SUMMARY:
----------------
1. File Selection:
   User Input → fileUri → filePath → appName

2. Tree Generation:
   filePath → buildComponentTree → treeObj

3. Webview Creation:
   appName → panel title
   appName + treeObj → webview HTML

4. Message System:
   webview ←→ extension
   Passes: tree data, file path, settings

DEBUGGING TIPS:
-------------
1. Check console logs for:
   - Webview loading
   - Message receipt
   - Data posting

2. Common Issues:
   - Missing file extensions
   - Invalid component files
   - Message handling errors
*/

