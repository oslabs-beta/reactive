# Development Scripts Guide

This guide provides detailed information about the npm scripts available in the project, their purposes, and when to use them during development.

## Scripts Overview

### `build`
- **Command**: `npm run compile && webpack --config webpack.config.js`
- **Purpose**: Transpiles TypeScript files and bundles the project using the development webpack configuration.
- **When to Use**: Use this script when you want to build the project for development.
- **Example Use Case**: 
  ```bash
  npm run build
  ```
- **Troubleshooting Tips**:
  - Ensure all TypeScript files are error-free before running the build.
  - Check the `webpack.config.js` for any misconfigurations.

### `build:prod`
- **Command**: `npm run compile && webpack --config webpack.prod.js`
- **Purpose**: Transpiles TypeScript files and bundles the project using the production webpack configuration.
- **When to Use**: Use this script when you want to build the project for production.
- **Example Use Case**: 
  ```bash
  npm run build:prod
  ```
- **Troubleshooting Tips**:
  - Ensure all TypeScript files are error-free before running the build.
  - Check the `webpack.prod.js` for any misconfigurations.

### `compile`
- **Command**: `tsc -p ./tsconfig.json`
- **Purpose**: Transpiles TypeScript files based on the `tsconfig.json` configuration.
- **When to Use**: Use this script when you want to compile TypeScript files without bundling.
- **Example Use Case**: 
  ```bash
  npm run compile
  ```
- **Troubleshooting Tips**:
  - Ensure the `tsconfig.json` is correctly configured.
  - Check for TypeScript compilation errors.

### `webpack`
- **Command**: `webpack`
- **Purpose**: Bundles the project using the default webpack configuration.
- **When to Use**: Use this script when you want to bundle the project without compiling TypeScript files.
- **Example Use Case**: 
  ```bash
  npm run webpack
  ```
- **Troubleshooting Tips**:
  - Ensure the default webpack configuration is correctly set up.
  - Check for any bundling errors.

### `watch`
- **Command**: `concurrently "webpack --watch" "tsc -watch -p ./tsconfig.json"`
- **Purpose**: Runs webpack and TypeScript compiler in watch mode for automatic rebuilds.
- **When to Use**: Use this script during development to automatically rebuild the project on file changes.
- **Example Use Case**: 
  ```bash
  npm run watch
  ```
- **Troubleshooting Tips**:
  - Ensure both webpack and TypeScript configurations are correct.
  - Check for any errors during the watch process.

### `lint`
- **Command**: `eslint src`
- **Purpose**: Lints the source files using ESLint.
- **When to Use**: Use this script to check for code quality and style issues.
- **Example Use Case**: 
  ```bash
  npm run lint
  ```
- **Troubleshooting Tips**:
  - Ensure ESLint is correctly configured.
  - Check for any linting errors and fix them.

### `pretest`
- **Command**: `npm run compile`
- **Purpose**: Transpiles TypeScript files before running tests.
- **When to Use**: This script is automatically run before the `test` script.
- **Example Use Case**: 
  ```bash
  npm run pretest
  ```
- **Troubleshooting Tips**:
  - Ensure the `compile` script runs successfully.

### `test`
- **Command**: `node ./out/test/runTest.js`
- **Purpose**: Runs the test suite.
- **When to Use**: Use this script to run all tests.
- **Example Use Case**: 
  ```bash
  npm run test
  ```
- **Troubleshooting Tips**:
  - Ensure all tests are correctly written and located in the appropriate directory.
  - Check for any test failures and fix them.

### `test:parser-performance`
- **Command**: `TEST_SUITE=parser-performance npm run test`
- **Purpose**: Runs the parser performance test suite.
- **When to Use**: Use this script to specifically test the performance of the parser.
- **Example Use Case**: 
  ```bash
  npm run test:parser-performance
  ```
- **Troubleshooting Tips**:
  - Ensure the parser performance tests are correctly written and located in the appropriate directory.
  - Check for any test failures and fix them.

### `package`
- **Command**: `vsce package`
- **Purpose**: Packages the extension into a `.vsix` file for distribution.
- **When to Use**: Use this script to create a package of the extension for publishing.
- **Example Use Case**: 
  ```bash
  npm run package
  ```
- **Troubleshooting Tips**:
  - Ensure all necessary files are included in the package.
  - Check for any packaging errors.
