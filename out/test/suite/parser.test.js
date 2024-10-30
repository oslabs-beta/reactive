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
// test/parser.test.ts
const assert = __importStar(require("assert"));
const path = __importStar(require("path"));
const parser_1 = require("../src/parser");
suite('Parser Tests', function () {
    suiteSetup(function () {
        // Setup code if needed
    });
    suiteTeardown(function () {
        // Teardown code if needed
    });
    setup(function () {
        // Runs before each test
    });
    teardown(function () {
        // Runs after each test
    });
    suite('Simple Components', function () {
        test('should parse a simple functional component', function () {
            const inputFilePath = path.join(__dirname, 'fixtures', 'SimpleFunctionalComponent.tsx');
            const baseDir = path.dirname(inputFilePath);
            const expectedOutput = {
                file: 'SimpleFunctionalComponent.tsx',
                type: 'functional',
                state: [],
                children: []
            };
            const result = (0, parser_1.buildComponentTree)(inputFilePath, baseDir);
            assert.deepStrictEqual(result, expectedOutput);
        });
    });
    suite('Complex Components', function () {
        test('should parse a component with children', function () {
            const inputFilePath = path.join(__dirname, 'fixtures', 'ParentComponent.tsx');
            const baseDir = path.dirname(inputFilePath);
            const expectedOutput = {
                file: 'ParentComponent.tsx',
                type: 'functional',
                state: [],
                children: [
                    {
                        file: 'ChildComponent.tsx',
                        type: 'functional',
                        state: [],
                        children: []
                    }
                ]
            };
            const result = (0, parser_1.buildComponentTree)(inputFilePath, baseDir);
            assert.deepStrictEqual(result, expectedOutput);
        });
    });
});
//# sourceMappingURL=parser.test.js.map