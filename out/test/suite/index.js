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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
// src/test/suite/index.ts
const path = __importStar(require("path"));
const mocha_1 = __importDefault(require("mocha"));
const glob_1 = require("glob");
async function run() {
    // Create the mocha test
    const mocha = new mocha_1.default({
        ui: 'tdd',
        color: true,
        timeout: 60000
    });
    const testsRoot = path.resolve(__dirname);
    try {
        console.log('Looking for test files in:', testsRoot);
        // Change the glob pattern to explicitly look for extension.test.ts/js
        const testFiles = await (0, glob_1.glob)(['**/extension.test.js', '**/dendrogram.test.js'], {
            cwd: testsRoot,
            absolute: true // Get absolute paths
        });
        console.log('Found test files:', testFiles);
        if (testFiles.length === 0) {
            console.warn('No test files found! Checking directory contents...');
            const allFiles = await (0, glob_1.glob)('**/*', {
                cwd: testsRoot,
                absolute: true
            });
            console.log('All files in directory:', allFiles);
        }
        // Add files to mocha
        testFiles.forEach(file => {
            console.log('Adding test file:', file);
            mocha.addFile(file);
        });
        // Run the mocha test
        return new Promise((resolve, reject) => {
            try {
                const runner = mocha.run(failures => {
                    if (failures > 0) {
                        reject(new Error(`${failures} tests failed.`));
                    }
                    else {
                        resolve();
                    }
                });
                runner.on('test', (test) => {
                    console.log('Running test:', test.title);
                });
            }
            catch (err) {
                console.error('Error running mocha:', err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.error('Error during test setup:', err);
        throw err;
    }
}
//# sourceMappingURL=index.js.map