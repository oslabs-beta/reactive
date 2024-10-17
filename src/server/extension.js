const vscode = require('vscode');
const path = require('path');
const { buildComponentTree } = require('./parser.js');

function activate(context) {
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

      const outputChannel = vscode.window.createOutputChannel('React Component Tree');
      outputChannel.appendLine(`Component Tree: ${JSON.stringify(tree, null, 2)}`);
      outputChannel.show();
    }
  });

  const renderReact = vscode.commands.registerCommand('reactive2.renderReact', () => {
    const panel = vscode.window.createWebviewPanel(
      'reactWebview',
      'React App',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'dist'))]
      }
    );

    const webviewJsPath = vscode.Uri.file(path.join(context.extensionPath, 'dist', 'webview.js'));
    const webviewJsUri = panel.webview.asWebviewUri(webviewJsPath);

    panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React App</title>
      </head>
      <body>
        <div id="root"></div>
        <script src="${webviewJsUri}"></script>
      </body>
      </html>
    `;
  });

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

      panel.webview.html = getWebviewContent(tree);
    }
  });

  context.subscriptions.push(makeComponentTree, renderReact, buildAndRenderComponentTree);
}

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

function deactivate() {}

module.exports = {
  activate,
  deactivate
};


