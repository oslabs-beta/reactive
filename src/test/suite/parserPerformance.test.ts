// src/test/suite/parserPerformance.test.ts

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

// TODO when migrating parser.js to TypeScript: update to ES6 import statement
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { buildComponentTree, parseFileToAST } = require('../../../src/server/parser.js');

/**
 * Performance Test Suite for Reactive's Parser
 * 
 * Tests parsing and tree building performance using realistic data
 * while ensuring coverage of all component types:
 * - Functional components (with and without state)
 * - Class components
 * - Null type components
 * 
 * SusanaApp (functional, state: gizmo, stripe)
 * ├── MicahContainer (functional, state: whiskey)
 * │   └── ErrorBoundary (class, state: hasError)
 * │       └── tooltip (null)
 * └── ColinContainer (functional, state: mogwai, spike)
 *     └── tooltip (null)
 */

// Define types for our components
type ComponentType = 'functional' | 'class' | null;

interface TestComponent {
    file: string;
    type: ComponentType;
    state: string[];
    imports: string[];
}

suite('Parser Performance Tests', function() {
    /**
     * Generates React component code based on type and state
     */
    function generateComponentContent(file: string, type: ComponentType, stateVars: string[], imports: string[]) {
        const componentName = path.basename(file, path.extname(file));
        const importStatements = imports
            .map(imp => `import ${path.basename(imp)} from '${imp}';`)
            .join('\n');

        switch (type) {
            case 'class':
                return `
import React, { Component } from 'react';
${importStatements}

// Class component with error boundary functionality
class ${componentName} extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ${stateVars.map(name => `${name}: false`).join(',\n            ')}
        };
    }
    
    render() {
        return <div>
            Protecting the app like ${componentName}!
            ${imports.map(imp => `<${path.basename(imp)} />`).join('\n            ')}
        </div>;
    }
}

export default ${componentName};`;

            case 'functional':
                const stateHooks = stateVars.map(name => 
                    `const [${name}, set${name}] = useState(null);`
                ).join('\n    ');
                
                return `
import React, { useState } from 'react';
${importStatements}

// Functional component with state management
const ${componentName} = () => {
    ${stateHooks}
    
    return (
        <div>
            ${componentName} is running the show
            ${stateVars.map(state => `<p>Current ${state}: {${state}}</p>`).join('\n            ')}
            ${imports.map(imp => `<${path.basename(imp)} />`).join('\n            ')}
        </div>
    );
};

export default ${componentName};`;

            default:
                return `
import React from 'react';

// Utility file - not a React component
export const ${componentName} = {
    showTooltip: (message) => console.log(message)
};`;
        }
    }

    test('Measure parsing performance with team components', function() {
        this.timeout(10000);
        const tmpDir = path.join(__dirname, 'temp_test');
        
        try {
            // Setup test directory and all component files
            fs.mkdirSync(tmpDir, { recursive: true });
            
            // Create all component files
            const components: TestComponent[] = [
                {
                    file: 'SusanaApp.tsx',
                    type: 'functional',
                    state: ['gizmo', 'stripe'],
                    imports: ['./MicahContainer', './ColinContainer']
                },
                {
                    file: 'MicahContainer.tsx',
                    type: 'functional',
                    state: ['whiskey'],
                    imports: ['./ErrorBoundary']
                },
                {
                    file: 'ErrorBoundary.tsx',
                    type: 'class',
                    state: ['hasError'],
                    imports: ['./tooltip']
                },
                {
                    file: 'tooltip.tsx',
                    type: null,
                    state: [],
                    imports: []
                },
                {
                    file: 'ColinContainer.tsx',
                    type: 'functional',
                    state: ['mogwai', 'spike'],
                    imports: ['./tooltip']
                }
            ];

            // Create each component file
            components.forEach(comp => {
                const filePath = path.join(tmpDir, comp.file);
                fs.writeFileSync(
                    filePath,
                    generateComponentContent(comp.file, comp.type, comp.state, comp.imports)
                );
            });

            // Test the root component (SusanaApp)
            const rootPath = path.join(tmpDir, 'SusanaApp.tsx');
            
            console.log('\nStarting performance test with team components! 🚀');

            // Measure AST parsing time
            console.log('\nParsing Susana\'s Gremlin-powered app... 🐣');
            const parseStart = process.hrtime();
            const ast = parseFileToAST(rootPath);
            const [parseSeconds, parseNanos] = process.hrtime(parseStart);
            const parseTime = (parseSeconds * 1000) + (parseNanos / 1000000);

            // Measure tree building time
            console.log('Building component tree (don\'t feed after midnight)... 🌙');
            const treeStart = process.hrtime();
            const tree = buildComponentTree(rootPath, tmpDir);
            const [treeSeconds, treeNanos] = process.hrtime(treeStart);
            const treeTime = (treeSeconds * 1000) + (treeNanos / 1000000);

            // Log performance results
            console.log('\n🎯 Performance Results:');
            console.log('----------------------');
            console.log(`AST Parsing Time: ${parseTime.toFixed(2)}ms`);
            console.log(`Tree Building Time: ${treeTime.toFixed(2)}ms`);
            console.log(`Total Processing Time: ${(parseTime + treeTime).toFixed(2)}ms`);

            // Validate the results
            assert.ok(ast, 'AST should be generated successfully');
            assert.ok(tree, 'Component tree should be built');
            assert.equal(tree.type, 'functional', 'Root should be a functional component');
            assert.deepEqual(tree.state, ['gizmo', 'stripe'], 'Susana\'s component should have gremlin states');
            
            // Component Statistics
            const stats = countComponents(tree);
            console.log('\n📊 Component Statistics:');
            console.log(`Total Components: ${stats.total}`);
            console.log(`Components with State: ${stats.withState}`);
            console.log(`Class Components: ${stats.classCount}`);
            console.log(`Null Components: ${stats.nullCount}`);

        } finally {
            // Cleanup
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    });

    /**
     * Analyzes the component tree and returns statistics
     */
    function countComponents(tree: any) {
        let stats = {
            total: 0,
            withState: 0,
            classCount: 0,
            nullCount: 0
        };

        function traverse(node: any) {
            stats.total++;
            if (node.state && node.state.length > 0) stats.withState++;
            if (node.type === 'class') stats.classCount++;
            if (node.type === null) stats.nullCount++;

            if (node.children) {
                node.children.forEach((child: any) => traverse(child));
            }
        }

        traverse(tree);
        return stats;
    }

    /**
     * Test that circular dependencies don't cause stack overflow
     *
     * ComponentA imports ComponentB
     * ComponentB imports ComponentA (circular!)
     */
    test('Handle circular dependencies without stack overflow', function() {
        this.timeout(5000);
        const tmpDir = path.join(__dirname, 'temp_circular_test');

        try {
            fs.mkdirSync(tmpDir, { recursive: true });

            // Create ComponentA that imports ComponentB
            const componentA = `
import React, { useState } from 'react';
import ComponentB from './ComponentB';

const ComponentA = () => {
    const [value, setValue] = useState(null);
    return <div><ComponentB /></div>;
};

export default ComponentA;`;

            // Create ComponentB that imports ComponentA (circular!)
            const componentB = `
import React, { useState } from 'react';
import ComponentA from './ComponentA';

const ComponentB = () => {
    const [data, setData] = useState(null);
    return <div><ComponentA /></div>;
};

export default ComponentB;`;

            fs.writeFileSync(path.join(tmpDir, 'ComponentA.tsx'), componentA);
            fs.writeFileSync(path.join(tmpDir, 'ComponentB.tsx'), componentB);

            const rootPath = path.join(tmpDir, 'ComponentA.tsx');

            console.log('\n🔄 Testing circular dependency handling...');

            // This should NOT throw a stack overflow error
            const tree = buildComponentTree(rootPath, tmpDir);

            console.log('✅ Circular dependency handled without crash!');

            // Validate the tree was built (with circular ref skipped)
            assert.ok(tree, 'Tree should be built despite circular dependency');
            assert.equal(tree.file, 'ComponentA.tsx', 'Root should be ComponentA');
            assert.equal(tree.type, 'functional', 'ComponentA should be functional');
            assert.ok(tree.children.length > 0, 'Should have children');

            // ComponentB should be a child, but ComponentA should NOT appear again as grandchild
            const componentB_child = tree.children[0];
            assert.equal(componentB_child.file, 'ComponentB.tsx', 'Child should be ComponentB');

            // The circular reference back to ComponentA should be null/filtered out
            const hasCircularChild = componentB_child.children.some(
                (child: any) => child && child.file === 'ComponentA.tsx'
            );
            assert.ok(!hasCircularChild, 'Circular reference should be skipped');

            console.log('✅ Circular dependency test passed!\n');

        } finally {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    });
});