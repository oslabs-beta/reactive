# Quick Start Guide: Reactive VS Code Extension

Get up and running with the **Reactive VS Code Extension** in just a few steps. Follow this guide to clone the repository and set up your development environment.

---

## 1. Clone the Repository
```bash
# Fork the repository to your GitHub account
git clone https://github.com/oslabs-beta/reactive.git
cd reactive
```

---

## 2. Install Dependencies
```bash
npm install
```

---

## 3. Start Development
```bash
npm run watch
```
This command enables live updates during development by watching for changes in your code.

---

## 4. Debug and Test the Extension
1. Open the project in VS Code.
2. Press `F5` to launch the Extension Development Host.
3. In the new window, open a React project.
4. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and run `Reactive: Start`.
5. Select the top-level component of your React app to visualize the component tree.

---

## 5. Build for Production
To prepare your extension for publishing:
```bash
npm run build:prod
npm run package
```
This will create a `.vsix` file that can be installed or published to the VS Code Marketplace.

---

## Detailed Instructions
For more in-depth guidance, refer to the following documents included in the repository:
- **[Development Scripts Guide](DEVELOPMENT_SCRIPTS.md)**: Detailed explanations of available scripts.
- **[VS Code Development Guide](VS_DEVELOPMENT.md)**: Best practices and debugging tips for extension development.
- **[Contributing Guidelines](CONTRIBUTING.md)**: Information for contributors and collaborators.

---

Happy coding with **Reactive**!
