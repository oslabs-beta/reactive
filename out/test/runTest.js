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
// src/test/runTest.ts
const path = __importStar(require("path"));
const test_electron_1 = require("@vscode/test-electron");
const os = __importStar(require("os"));
async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');
        const extensionTestsPath = path.resolve(__dirname, './suite/index');
        const userDataDir = path.join(os.tmpdir(), 'vscode-test-user-data');
        console.log('Test paths:');
        console.log('Development path:', extensionDevelopmentPath);
        console.log('Tests path:', extensionTestsPath);
        console.log('User data path:', userDataDir);
        await (0, test_electron_1.runTests)({
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: ['--user-data-dir', userDataDir]
        });
    }
    catch (err) {
        console.error('Failed to run tests:', err);
        process.exit(1);
    }
}
main();
