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
    plugins: ['jsx', 'typescript'],     // Enable JSX support
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

    VariableDeclarator(path) {
      //const result = {};
        if (path.node && path.node.init && path.node.init.callee && path.node.init.callee.name === 'useState'){
          stateVariables.push(path.node.id.elements[0].name)
      };
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
  /* DEBUG LOGGING GUIDE
   * To enable full debug logging, uncomment the console.log statements below
   * Logging levels:
   * 1. Basic: Only show import findings and warnings / see how buildComponentTree works
   * 2. Detailed: Show file checking and extension matching (uncomment Level 2)
   * 3. Verbose: Show all processing steps (uncomment Level 2 & 3)
   */

  const absoluteFilePath = path.resolve(baseDir, filePath);
  // LEVEL 3: Process Start
  // console.log('\n=== Starting buildComponentTree ===');
  // console.log('Checking file:', absoluteFilePath);

  if (!fs.existsSync(absoluteFilePath)) {
    // LEVEL 2: File Resolution
    // console.error(`File does not exist, absoluteFilePath : ${absoluteFilePath}`);
    return null;
  }

  const ast = parseFileToAST(absoluteFilePath);
  const {type, stateVariables} = findComponentTypeAndState(ast);
  
  // LEVEL 1: Import Detection (To see how buildComponentTree works)
  const imports = findImportsInAST(ast);
  //console.log('Found imports:', imports);

  const children = imports
    .map((importPath) => {
      // LEVEL 3: Import Processing
      // console.log('\n--- Processing import:', importPath);

      /* Extension Matching Process:
       * 1. Try each extension in order: .js -> .jsx -> .ts -> .tsx
       * 2. First match is used
       * 3. If no match, returns null and logs warning
       */
      const extensions = ['.jsx', '.tsx'];
      let resolvedPath = null;
      
      for (const ext of extensions) {
        const testPath = path.resolve(path.dirname(absoluteFilePath), `${importPath}${ext}`);
        // LEVEL 2: Extension Testing
        // console.log(`Testing path ${ext}:`, testPath);
        if (fs.existsSync(testPath)) {
          resolvedPath = testPath;
          // LEVEL 2: Match Found
          // console.log('Found matching file with extension, ext :', ext);
          break;
        }
      }
      
      // LEVEL 1: Resolution Failures 
      if (!resolvedPath) {
        console.warn(`Warning: No matching file found for import, importPath: ${importPath}`);
        return null;
      }

      return buildComponentTree(resolvedPath, baseDir);
    })
    .filter(Boolean);

  return {
    file: path.basename(filePath),
    type: type,
    state: stateVariables,
    children: children.filter(Boolean),
  };
}

/* USAGE EXAMPLES:
 *
 * // Basic usage (Level 1 logging)
 * const tree = buildComponentTree('./src/App.jsx', './src');
 * 
 * // For debugging extension resolution (Level 2)
 * // Uncomment Level 2 logs to see:
 * // - File existence checks
 * // - Extension matching attempts
 * // - Successful matches
 *
 * // For full debug output (Level 3)
 * // Uncomment all logs to see:
 * // - Process start/end
 * // - All file operations
 * // - Import processing
 * // - Extension matching
 */

module.exports = { buildComponentTree };
