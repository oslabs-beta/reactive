"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/test/suite/example.test.ts
const assert = __importStar(require("assert"));
const vscode = __importStar(require("vscode"));
/**
 * Example Test Suite
 *
 * This file demonstrates different types of tests you can write for VS Code extensions.
 * Use it as a reference when creating your own tests.
 */
suite('Example Test Suite', () => {
    // Run before all tests in the suite
    suiteSetup(() => {
        console.log('Test Suite Setup - Runs once before all tests');
    });
    // Run after all tests in the suite
    suiteTeardown(() => {
        console.log('Test Suite Teardown - Runs once after all tests');
    });
    // Run before each test
    setup(() => {
        console.log('Test Setup - Runs before each test');
    });
    // Run after each test
    teardown(() => {
        console.log('Test Teardown - Runs after each test');
    });
    /**
     * 1. Basic Assertion Test
     * Demonstrates simple assertion testing
     */
    test('Basic assertion example', () => {
        const value = 42;
        assert.strictEqual(value, 42);
        assert.notStrictEqual(value, 43);
    });
    /**
     * 2. Async Test Example
     * Demonstrates how to test asynchronous operations
     */
    test('Async operation example', async () => {
        const result = await Promise.resolve(true);
        assert.strictEqual(result, true);
    });
    /**
     * 3. VS Code API Test
     * Demonstrates how to test VS Code specific functionality
     */
    test('VS Code API example', async () => {
        // Test that we can access the VS Code API
        assert.ok(vscode.window);
        // Example: Test opening a text document
        const doc = await vscode.workspace.openTextDocument({
            content: 'Hello, World!'
        });
        assert.strictEqual(doc.getText(), 'Hello, World!');
    });
    /**
     * 4. Command Test Example
     * Demonstrates how to test VS Code commands
     */
    test('Command execution example', async () => {
        // Register a command
        const disposable = vscode.commands.registerCommand('test.helloWorld', () => {
            return 'Hello World!';
        });
        try {
            // Execute the command
            const result = await vscode.commands.executeCommand('test.helloWorld');
            assert.strictEqual(result, 'Hello World!');
        }
        finally {
            // Clean up
            disposable.dispose();
        }
    });
    /**
     * 5. Error Case Test
     * Demonstrates how to test error conditions
     */
    test('Error handling example', async () => {
        // Using assert.throws for synchronous code
        assert.throws(() => {
            throw new Error('Test error');
        }, Error);
        // Using assert.rejects for asynchronous code
        await assert.rejects(async () => {
            throw new Error('Async test error');
        }, Error);
    });
    /**
     * 6. Workspace Test
     * Demonstrates how to test workspace-related functionality
     */
    test('Workspace example', async () => {
        // Check if we have an active workspace
        assert.ok(vscode.workspace.workspaceFolders);
        if (vscode.workspace.workspaceFolders) {
            const firstFolder = vscode.workspace.workspaceFolders[0];
            assert.ok(firstFolder.uri);
            assert.ok(firstFolder.name);
        }
    });
});
//# sourceMappingURL=example.test.js.map