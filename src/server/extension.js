const vscode = require('vscode');
const path = require('path');
const { buildComponentTree } = require('./parser.js');

// Activate the extension, setting up command listeners
function activate(context) {
  
  /**
   * Render the React application in a Webview.
   * This function creates a new Webview panel and displays an HTML page
   * that loads a React app script from the extension's dist folder.
   */
  const renderReact = vscode.commands.registerCommand('reactive2.renderReact', () => {
    const panel = vscode.window.createWebviewPanel(
      'reactWebview',            // Internal identifier for the webview
      'React App',               // Title of the webview panel
      vscode.ViewColumn.One,     // Column to show the webview in
      {
        enableScripts: true,     // Allow JavaScript execution in the webview
        localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'dist'))]
      }
    );

    // Path to the webview's JavaScript file
    const webviewJsPath = vscode.Uri.file(path.join(context.extensionPath, 'dist', 'webview.js'));
    const webviewJsUri = panel.webview.asWebviewUri(webviewJsPath);

    // HTML content for the webview
    panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React Component Tree</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script src="${webviewJsUri}"></script>
      </body>
      </html>
    `;
  });

  /**
   * Build and render the React component tree in a Webview.
   * Prompts the user to select a file, builds the component tree, and renders it in a new webview.
   */
  const buildAndRenderComponentTree = vscode.commands.registerCommand('reactive.reactWebviewTree', async () => {
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

      const panel = vscode.window.createWebviewPanel(
        'componentTreeWebview',
        'Component Tree',
        vscode.ViewColumn.One,
        {
          enableScripts: true
        }
      );

      // Renders the tree structure inside the webview
      panel.webview.html = getWebviewContent(tree);
    }
  });

  /**
   * Display the React component tree in the Output channel.
   * Prompts the user to select a file, builds the component tree, and displays it in the VSCode Output panel.
   */
  const makeComponentTree = vscode.commands.registerCommand('reactive2.makeComponentTree', async () => {
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

  // Register all the commands to the context, so VSCode can activate them
  context.subscriptions.push(makeComponentTree, renderReact, buildAndRenderComponentTree);
}

/**
 * Helper function to generate the HTML content for displaying the component tree.
 * @param {Object} tree - The React component tree object
 */
function getWebviewContent(tree) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Component Tree</title>
        <style>
            body { font-family: Arial, sans-serif; }
            ul { list-style-type: none; }
            li { margin: 10px 0; }
            .file { font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>Component Tree</h1>
        ${renderTree(tree)}
        <script>
            const toggles = document.querySelectorAll('.toggle');
            toggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const content = toggle.nextElementSibling;
                    content.style.display = content.style.display === 'none' ? 'block' : 'none';
                });
            });
        </script>
    </body>
    </html>
  `;
}

/**
 * Recursive function to render the React component tree into HTML list elements.
 * @param {Object} node - A node in the React component tree
 * @returns {String} - The HTML string representing the tree
 */
function renderTree(node) {
  if (!node) return '';
  let html = `<li>
    <span class="file">${node.file}</span>
    ${node.children && node.children.length ? `
      <button class="toggle">Toggle</button>
      <ul style="display: none;">
        ${node.children.map(child => renderTree(child)).join('')}
      </ul>
    ` : ''}
  </li>`;
  return html;
}

// Deactivate the extension
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
