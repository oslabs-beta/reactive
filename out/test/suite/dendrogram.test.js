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
const assert = __importStar(require("assert"));
const jsdom_1 = require("jsdom");
// TDD (Test Driven Development) | BDD (Behavior Driven Development)
// ---------------------------- | -----------------------------
// suite()                      | describe()
// test()                       | it()
// setup()                      | beforeEach()
// teardown()                   | afterEach()
// suiteSetup()                 | before()
// suiteTeardown()              | after()
// Set up a basic browser-like environment for testing
const dom = new jsdom_1.JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
// This is our main test group
suite('Simple Dendrogram Tests', function () {
    // This runs before each test group
    suiteSetup(function () {
        // Log when tests start - helpful for debugging
        console.log('Starting Dendrogram tests');
    });
    // Test Group 1: Basic Tests
    suite('Basic Tests', function () {
        // Test 1: Check if we can create an SVG
        test('should create an SVG element', function () {
            // Create an SVG element
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            // Check if the SVG was created
            assert.ok(svg, 'SVG should exist');
        });
        // Test 2: Check SVG size
        test('should set correct SVG size', function () {
            // Create an SVG element
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            // Set the size
            svg.setAttribute('width', '600');
            svg.setAttribute('height', '400');
            // Check if size is correct
            assert.strictEqual(svg.getAttribute('width'), '600', 'Width should be 600');
            assert.strictEqual(svg.getAttribute('height'), '400', 'Height should be 400');
        });
    });
    // Test Group 2: Data Tests
    suite('Data Tests', function () {
        // This is example data we'll test with
        const sampleData = {
            name: "Parent",
            children: [
                { name: "Child1" },
                { name: "Child2" }
            ]
        };
        // Test 3: Check data structure
        test('should have correct data structure', function () {
            // Check if data has a name
            assert.ok(sampleData.name, 'Data should have a name');
            // Check if data has children
            assert.ok(sampleData.children, 'Data should have children');
            // Check if we have the right number of children
            assert.strictEqual(sampleData.children.length, 2, 'Should have 2 children');
        });
        // Test 4: Check children's names
        test('should have named children', function () {
            // Check first child's name
            assert.strictEqual(sampleData.children[0].name, 'Child1', 'First child should be named Child1');
            // Check second child's name
            assert.strictEqual(sampleData.children[1].name, 'Child2', 'Second child should be named Child2');
        });
    });
    // This runs after all tests are done
    suiteTeardown(function () {
        // Log when tests complete
        console.log('Finished Dendrogram tests');
    });
});
//# sourceMappingURL=dendrogram.test.js.map