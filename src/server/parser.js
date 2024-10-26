const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// Helper function to read files and parse the AST
function parseFileToAST(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    return null;
  }
  const code = fs.readFileSync(filePath, 'utf-8');
  
  return parser.parse(code, {
    sourceType: 'module', // ECMAScript module
    plugins: ['jsx'],     // Enable JSX support
  });
}

// //Helper function to get component type (class or function)
// function getComponentType(node) {
//   if (node.type === 'ClassDeclaration') return 'class';
//   if (node.type === 'FunctionDeclaration' || node.type === 'ArrowFunctionExpression') return 'functional';
//   return 'unknown';
// }

// Helper function to get component name from an AST node
function getComponentName(node) {
  if (node.id && node.id.name) return node.id.name;  // For function or class components
  if (node.declaration && node.declaration.id) return node.declaration.id.name;  // For export default
  return null;
}

// Traverse the AST and determine the component type (class or functional)
function findComponentTypeAndState(ast) {
  let type = null;
  const stateVariables = [];

  traverse(ast, {
    // Check for class component
    ClassDeclaration(path) {
      const componentName = getComponentName(path.node);
      if (componentName) {
        type = 'class';  // Mark it as a class component
      }
    },
    // Check for functional component
    FunctionDeclaration(path) {
      const componentName = getComponentName(path.node);
      if (componentName) {
        type = 'functional';  // Mark it as a functional component
      }
    },
    // Check for arrow functional component
    VariableDeclaration(path) {
      const declaration = path.node.declarations[0];
      if (declaration && declaration.init && declaration.init.type === 'ArrowFunctionExpression') {
        const componentName = declaration.id.name;
        if (componentName) {
          type = 'functional';  // Mark it as a functional component
        }
      }
    },
    //Parse for state data
    CallExpression(path) {
       if (path.node.callee.name === 'useState') {
        const [stateVar, setter] = path.node.arguments;
        if (stateVar && stateVar.type === 'ArrayPattern') {
           stateVar.elements.forEach(element => {
            if (element.type === 'Identifier') {
               // Ignore setter functions, include only state variables
               /*if (!element.name.startsWith('set')) {*/
                stateVariables.push(element.name);
               //}
            }
           });
        }  
       }
    }
  });

  return {type, stateVariables };
}

// Parse the imports to identify child components
function findImportsInAST(ast) {
  const imports = [];

  if (!ast) return imports;

  traverse(ast, {
    ImportDeclaration(path) {
      const importedFilePath = path.node.source.value;
      
      // Skip external libraries like React, ReactDOM, etc.
      if (!importedFilePath.startsWith('.') && !importedFilePath.startsWith('/')) {
        return;  // This is an external dependency, not a local file
      }
      
      imports.push(importedFilePath);
    }
  });

  return imports;
}

// Build a component tree from the file system and source code
function buildComponentTree(filePath, baseDir) {
  const absoluteFilePath = path.resolve(baseDir, filePath);

  if (!fs.existsSync(absoluteFilePath)) {
    console.error(`File does not exist: ${absoluteFilePath}`);
    return null;
  }

  const ast = parseFileToAST(absoluteFilePath);
  
  // Determine the component type (functional or class)
  const {type, stateVariables } = findComponentTypeAndState(ast);
  
  // Find imports to identify child components
  const imports = findImportsInAST(ast);

  const children = imports
    .map((importPath) => {
      // Resolve relative import path to an actual file
      const resolvedImportPath = path.resolve(path.dirname(absoluteFilePath), `${importPath}.jsx`);
      
      if (!fs.existsSync(resolvedImportPath)) {
        console.warn(`Warning: Imported file not found: ${resolvedImportPath}`);
        return null;
      }

      return buildComponentTree(resolvedImportPath, baseDir);
    })
    .filter(Boolean); // Remove any null values

  // Return just the file name and the component type
  return {
    file: path.basename(filePath),  // Return the file name instead of full path
    type: type,  // Return the component type (class or functional)
    state: stateVariables,
    children: children.filter(Boolean), // Remove any invalid entries
  };
}

module.exports = { buildComponentTree };
