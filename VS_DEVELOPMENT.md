# VS Code Extension Development Guidelines

## Project Structure Overview
```
reactive/
├── src/                    # TypeScript/JavaScript source files
│   ├── server/            # Extension backend
│   │   ├── extension.ts   # Extension entry point
│   │   └── parser.ts      # Parser implementation
│   ├── webview/           # React-based webview
│   │   ├── App.jsx        # Main webview component
│   │   └── ...           # Other React components
│   └── types.ts           # Type definitions
├── dist/                  # Compiled distribution files
├── out/                   # Compiled output
└── test/                  # Test files
```

## Development Workflow

### 1. Extension Development
The extension consists of two main parts:
- Backend (`src/server/`): Handles VS Code integration
- Webview (`src/webview/`): Provides the UI

#### Backend Development
- Work in `src/server/extension.ts` for VS Code API integration
- Implement parsing logic in `src/server/parser.ts`
- Use VS Code Extension API for:
  - Command registration
  - TreeView providers
  - Webview communication
  - Workspace file handling

#### Webview Development
- React components in `src/webview/`
- Use VS Code webview API for:
  - Message passing
  - Theme integration
  - State management

### 2. Building and Running

```bash
# Install dependencies
npm install

# Watch mode for development
npm run watch

# Build extension
npm run build

# Package extension
npm run package
```

### 3. Testing
- Write tests in `src/test/suite/`
- Run tests with:
  ```bash
  npm run test
  ```
- Test categories:
  - Extension tests (`extension.test.ts`)
  - Parser tests (`parser.test.ts`)
  - Component tests (`*.test.ts`)

### 4. Debugging
1. Press F5 in VS Code to launch extension development host
2. Use Debug Console for logs
3. Set breakpoints in TypeScript files
4. Use VS Code's Developer Tools for webview debugging

## Best Practices

### Extension Development
1. Use VS Code API properly:
   ```typescript
   // Good
   vscode.window.createWebviewPanel(...)
   
   // Avoid
   document.createElement(...)
   ```

2. Handle disposables:
   ```typescript
   class MyExtension {
     private disposables: vscode.Disposable[] = [];
     
     activate() {
       this.disposables.push(
         vscode.commands.registerCommand(...)
       );
     }
     
     deactivate() {
       this.disposables.forEach(d => d.dispose());
     }
   }
   ```

### Webview Development
1. Use VS Code's message passing:
   ```typescript
   // In webview
   vscode.postMessage({ type: 'update', data: {...} });
   
   // In extension
   panel.webview.onDidReceiveMessage(message => {...});
   ```

2. Follow VS Code's theme:
   ```css
   /* Use VS Code's theme variables */
   color: var(--vscode-editor-foreground);
   background: var(--vscode-editor-background);
   ```

### Performance
1. Lazy load webview content
2. Use proper activation events
3. Minimize extension size
4. Cache parsed results

## Common Gotchas
1. Webview content security policy
2. Extension context disposal
3. Resource loading in webviews
4. Extension activation events

## Publishing
1. Update `package.json` metadata
2. Test in clean environment
3. Create changelog entry
4. Package extension:
   ```bash
   vsce package
   ```
5. Publish:
   ```bash
   vsce publish
   ```