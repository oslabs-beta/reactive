# Quick Start Guide

This guide provides step-by-step instructions for setting up your own dual-target Webpack configuration for a React-powered VSCode extension. Whether you're contributing to the Reactive project or starting fresh, these steps will get you up and running quickly.

## 1. Clone the Repository
To follow along with our setup, clone the Reactive project repository:
```bash
# Clone the repository
git clone https://github.com/oslabs-beta/reactive.git

# Navigate to the project directory
cd reactive

# Install dependencies
npm install
```

---

## 2. Build the Project
The `package.json` scripts automate the build process for development and production.

### For Development:
```bash
# Watch mode for live updates during development
npm run watch
```

### For Production:
```bash
# Build for production (optimized)
npm run build:prod

# Create the .vsix file
npm run package
```

---

## 3. Test the Extension
Use the VSCode Extension Development Host to test your extension:

1. Open the project in VS Code.
2. Press `F5` or go to **Run > Start Debugging**.
3. This will launch a new VS Code window with your extension installed.

---

## 4. Package the Extension
When you're ready to publish, package the extension into a `.vsix` file:
```bash
npm run build:prod
npm run package
```

The `.vsix` file will be created in the project directory and can be uploaded to the VSCode marketplace. **TEST IT FIRST**! Multiple times. Here's how:

1. In VS Code, go to the Extensions view (`Shift+Option+X` on Mac).
2. Click the hamburger menu at the top-left and select **Install from VSIX...**.
3. Locate the `.vsix` file and install it. This will simulate downloading it from the marketplace to ensure the experience is seamless for users.

---

## 5. Customize the Configuration
- **Adjust Webpack Configurations**: Modify `webpack.config.js` or `webpack.prod.js` to fit your project structure. Ours is just one approach.
- **Update `tsconfig.json`**: Ensure TypeScript settings align with your coding style and target environments. Expect to update this frequently as your code evolves.
- **Refine `.vscodeignore`**: Exclude unnecessary files from your packaged extension. This ensures your `.vsix` file remains small and efficient for users to download.

---

## Additional Information

### Why Use Dual-Target Webpack?
- **Backend Configuration:** Ensures compatibility with the Node.js runtime for the VSCode extension.
- **Frontend Configuration:** Prepares the React webview for rendering within the sandboxed VSCode environment.

### Common Pitfalls
- **`.vscodeignore` Misconfiguration:** Double-check your `.vscodeignore` to prevent excluding files critical for runtime.
- **Testing Overlooked:** Always simulate user scenarios by repeatedly testing `.vsix` installation.

---

## Detailed Instructions
For more in-depth guidance, refer to the following documents included in the repository:
- **[Development Scripts Guide](DEVELOPMENT_SCRIPTS.md)**: Detailed explanations of available scripts.
- **[VS Code Development Guide](VS_DEVELOPMENT.md)**: Best practices and debugging tips for extension development.
- **[Contributing Guidelines](CONTRIBUTING.md)**: Information for contributors and collaborators.

Happy coding with **Reactive**!

