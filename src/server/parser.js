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

// Helper function to get component type (class or function)
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
    // Parse for state data
    // CallExpression(path) {
    //    if (path.node.callee.name === 'useState') {
    //     const [stateVar, setter] = path.node.arguments;
    //     if (stateVar && stateVar.type === 'ArrayPattern') {
    //        stateVar.elements.forEach(element => {
    //         if (element.type === 'Identifier') {
    //            // Ignore setter functions, include only state variables
    //            /*if (!element.name.startsWith('set')) {*/
    //             stateVariables.push(element.name);
    //            //}
    //         }
    //        });
    //     }  
    //    }
    // }
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
  console.log('\n=== Starting buildComponentTree ===');
  console.log('Checking file:', absoluteFilePath);

  if (!fs.existsSync(absoluteFilePath)) {
    console.error(`File does not exist, absoluteFilePath : ${absoluteFilePath}`);
    return null;
  }

  const ast = parseFileToAST(absoluteFilePath);
  
  // Determine the component type (functional or class)
  const {type, stateVariables } = findComponentTypeAndState(ast);
  
  // Find imports to identify child components
  const imports = findImportsInAST(ast);
  console.log('Found imports:', imports);

  const children = imports
    .map((importPath) => {
      console.log('\n--- Processing import:', importPath);
      // Try each extension until we find a matching file
      const extensions = ['.js', '.jsx', '.ts', '.tsx'];
      let resolvedPath = null;
      
      for (const ext of extensions) {
        const testPath = path.resolve(path.dirname(absoluteFilePath), `${importPath}${ext}`);
        console.log(`Testing path ${ext}:`, testPath);
        if (fs.existsSync(testPath)) {
          resolvedPath = testPath;
          console.log('Found matching file with extension, ext :', ext);
          break;
        }
      }
      
      if (!resolvedPath) {
        console.warn(`Warning: No matching file found for import, importPath: ${importPath}`);
        return null;
      }

      return buildComponentTree(resolvedPath, baseDir);
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

// Example usage:
// const baseDir = './client';  // The base directory containing your components
// const entryFile = './src/components/App.jsx';  // The entry point of your component tree

// const tree = buildComponentTree(entryFile, baseDir);
// console.log(JSON.stringify(tree, null, 2));
