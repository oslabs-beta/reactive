# Reactive VS Code Extension

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/oslabs-reactive.reactive)](https://marketplace.visualstudio.com/items?itemName=oslabs-reactive.reactive)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/oslabs-reactive.reactive)](https://marketplace.visualstudio.com/items?itemName=oslabs-reactive.reactive)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

**Reactive** is a powerful VS Code extension designed to enhance the development experience for React applications. Developed as part of the OSLabs program, this tool provides a comprehensive visual representation of your React component structure, making it easier to understand and navigate React projects. 

## Installation

1. Open VS Code.
2. Go to the Extensions view (`Ctrl+Shift+X`).
3. Search for "Reactive".
4. Click **Install**.

## Usage

1. Open a React project in VS Code.
2. Access the Reactive from the VS Code sidebar.
3. Click on components in the tree to collapse.
4. Click on State within component node to open State details 

## Features

- **Component Tree Visualization**: Procure a clear, hierarchical view of your React component structure.
- **Component Type Differentiation**: Easily distinguish between functional and class components.
- **Language Identification**: Quickly identify TypeScript and JavaScript components.
- **Full App Structure**: Visualize the entire structure of your React application.
- **State Inspection**: Identify state variables across components. 

## Product Description

Oftentimes as applications scale, it becomes increasingly challenging to keep track of the structure of an app. As a result, this extends the amount of time it takes for new developers to understand the application landscape and makes it impractical to keep track of code migration progress.   

Reactive aims to solve this problem by generating a visual representation of your app's component landscape within VS Code. This extension enables greater visibility into the architecture of the React app and is especially valuable for teams transitioning from class-based components to functional components, as well as from JavaScript to TypeScript.

## Contributing to Reactive 🤝

We love your input! Reactive is an open-source project, and we welcome contributors of all skill levels.

### Quick Start
```bash
# Fork and clone the repository
git clone https://github.com/your-username/reactive.git

# Install dependencies
npm install

# Start development environment
npm run dev
```

### Ways to Contribute
- Fix bugs and issues
- Add new features
- Improve documentation
- Submit feature requests
- Report bugs
- Review code

### Getting Started
- **First Time Contributors**: Check out our [First-Time Contributors Guide](CONTRIBUTING.md#new-to-open-source)
- **Ready to Code**: See our [Contribution Guidelines](CONTRIBUTING.md#experienced-contributor-guide)
- **Looking for Tasks**: Browse our [good first issues](https://github.com/oslabs-beta/reactive/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

For detailed setup instructions, coding guidelines, and best practices, see our [CONTRIBUTING.md](CONTRIBUTING.md).

## Development Setup

### For Contributors
1. **Fork & Clone**
   ```bash
   # Fork the repository first on GitHub, then:
   git clone https://github.com/your-username/reactive.git
   cd reactive
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Initial Build**
   ```bash
   npm run build
   ```

4. **Start Development**
   ```bash
   # Watch mode for automatic rebuilds
   npm run watch
   ```

5. **Launch Extension in Debug Mode**
   - Press `F5` in VS Code to open Extension Development Host
   - OR select Run > Start Debugging
   - A new VS Code window will open with the extension loaded

6. **Test the Extension**
   - Open a React project in the Extension Development Host
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type and select `Reactive: Start`
   - Select the highest-level component in your React application
   - The component tree visualization will appear

### Common Development Commands
```bash
# Start or Refresh debugger/Extension Development Host
fn F5
```

### Production Build & Testing
```bash
# Create production build
npm run build:prod

# Package extension into .vsix file
npm run package

# Test the packaged extension
# 1. In VS Code, in the Extensions view click the '...' menu (top left)
# 2. Select 'Install from VSIX...'
# 3. Choose the generated .vsix file
# 4. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
# 5. Type and select `Reactive: Start`
# 6. Select the highest-level component in your React application
#  The component tree visualization will appear
```

### Debugging Tips
- Use VS Code's Debug Console to view extension logs
- Set breakpoints in the TypeScript files
- Use `console.log` in the webview (outputs to DevTools in Extension Development Host)
- Access Extension Development Host's Developer Tools:
  - Help > Toggle Developer Tools

### Common Issues
- If the extension bla bla bla:
  1. Stop the extension
  2. Run ``
  3. Restart debugging (`F5`)
- If webview bla bla bla:
  1. Run Command ? (`Ctrl+Shift+P`)
  2. Execute "bla bla bla"
  
### Development Scripts Guide
For detailed information about the npm scripts available in the project, their purposes, and when to use them during development, please refer to the [Development Scripts Guide](DEVELOPMENT_SCRIPTS.md).


## Technologies Used

### Core Technologies
- **VS Code Extension API** - For extension development and VS Code integration
- **React 18** - Frontend framework for the webview interface
- **TypeScript/JavaScript** - Primary development languages
- **D3.js** - For component tree visualization and dendrograms
- **Webpack 5** - Module bundling for both extension and webview

### Development Tools
- **Babel** - JavaScript/TypeScript compilation and React preprocessing
- **ESLint** - Code quality and style checking
- **Mocha** - Testing framework

### Extension Architecture
- **Backend**: Node.js-based VS Code extension (TypeScript/JavaScript)
- **Frontend**: React-based webview (TypeScript/JavaScript)
- **Parser**: Custom React component parser using Babel

### Project Structure
```
reactive/
├── src/                    # Source code
│   ├── server/            # Extension backend (TS/JS)
│   ├── webview/           # React frontend (TS/JS)
│   └── test/              # Test suites
├── dist/                  # Frontend production builds
└── out/                   # Backend builds (dev/prod) & frontend dev builds
```

## Documentation

- [Contributing Guidelines](CONTRIBUTING.md)
- [VS Code Development Guide](VS_CODE_DEVELOPMENT.md)
- [Changelog](CHANGELOG.md)
- [License](LICENSE.md)

## Development Team

| Name          | Role               | GitHub                        | Email                   |
| ------------- | ------------------ | ----------------------------- | ----------------------- |
| Colin Rooney  | Software Engineer  | [@12mv2](https://github.com/12mv2) | captaincolinr@gmail.com |
| Micah Zeigler | Software Engineer  | [@MZiegler96](https://github.com/MZiegler96) | micahziegler.se@gmail.com    |
| Susana Lam    | Software Engineer  | [@susanalam](https://github.com/susanalam)  | susana.lam1017@gmail.com    |

## Support

If you encounter any issues or have feature requests, please file an issue on our GitHub repository Reactive, https://github.com/oslabs-beta/reactive.

## OSLabs

**React Visualizer** is a project developed through OSLabs, a nonprofit tech accelerator focused on advancing open-source software and fostering innovation in the tech industry. OSLabs is dedicated to supporting engineers and leaders building high-impact, collaborative open-source tools.

**OSLabs' Mission**:
OSLabs is devoted to furthering open-source innovation by supporting engineering talent in creating developer tools that contribute to the software engineering community and industry as a whole.

For more information about OSLabs:
- Visit: [OSLabs Website](https://opensourcelabs.io)
- Email: hello@opensourcelabs.io
- Phone: (601) 207-4517

### OSLabs Programs

- **Engineering Fellowship**: A paid 6-month program where engineers create and oversee open-source dev tool projects.
- **Beta Program**: A 3-month initiative where participants receive mentorship to build their open-source skills.
- **Hackathons**: Co-hosted hackathons with open-source-focused organizations.

## Acknowledgements

This project was developed as part of the OSLabs program. We'd like to thank OSLabs for their support and resources.

---

Happy coding with **Reactive**!
