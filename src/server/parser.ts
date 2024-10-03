const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const { traverse, NodePath } = require('@babel/traverse').default;
const { File, Identifier, CallExpression } = require('@babel/types');
const {TreeObject} = require('./types')

// Helper function to read files and parse to an AST for babel traverse
function parseFileToAST(filePath: string): File | null {

  //edge case
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    return null;
  }

  //read source code and return contents as a string
  const code = fs.readFileSync(filePath, 'utf-8');

  //translate the returned string into an abstract syntax tree -- an AST is an object full of nested objects where each object is a node
  return parser.parse(code, {
    sourceType: 'module', // source code is written in ECMAScript module format
    plugins: ['jsx'],     // Enable JSX support
  });
}


// Helper function to get component name from an AST node
function getComponentName(node: typeof NodePath) {
  if (node.id && node.id.name) return node.id.name;  // For function or class components
  if (node.declaration && node.declaration.id) return node.declaration.id.name;  // For export default
  return null;
}

// Traverse the AST and determine the component type (class or functional)
function findComponentTypeAndState(ast: File): { type: 'class' | 'functional' | null; stateVariables: string[] }  {
  let type: 'class' | 'functional' | null = null;
  const stateVariables: string[] = [];

  //traverse recursively moves through the AST and checks each node type  
  traverse(ast, {
    // Check for class component
    ClassDeclaration(path: typeof NodePath) {
      const componentName = getComponentName(path.node); //line 29
      if (componentName) {
        type = 'class';  // Mark it as a class component
      }
    },

    // Check for functional component
    FunctionDeclaration(path: typeof NodePath) {
      const componentName = getComponentName(path.node); //line 29
      if (componentName) {
        type = 'functional';  // Mark it as a functional component
      }
    },

    // Check for arrow functional component
    VariableDeclaration(path: typeof NodePath) {
      const declaration = path.node.declarations[0];
      if (declaration.init.type === 'ArrowFunctionExpression') {
        const componentName = declaration.id.name;
        if (componentName) {
          type = 'functional';  // Mark it as a functional component
        }
      }
    },

    VariableDeclarator(path: typeof NodePath) {
      //const result = {};
        if (path.node.init.callee.name === 'useState'){
          stateVariables.push(path.node.id.elements[0].name)
      };
      // const initializedState = path.node.init.arguments[0];
  
      // // Iterate through the properties of the ObjectExpression
      // initializedState.properties.forEach((prop: typeof NodePath) => {
      //   if (prop.type === 'ObjectProperty') {
      //     const k: string = prop.key.name; // Get the property name
      //     const v: string | number = prop.value.value; // Get the property value
      //     result.k = v; // Assign to the result object
      //   }
      // });
      //return result; 
    },
  });

  return {type, stateVariables };
}

// Parse the imports to identify child components
function findImportsInAST(ast: File): string[] {
  const imports: string[] = [];

  if (!ast) return imports;

  traverse(ast, {
    ImportDeclaration(path: typeof NodePath) {
      const importedFilePath = path.node.source.value;
      
      // only inlcude files imported locally
      if (importedFilePath.startsWith('.') || importedFilePath.startsWith('/')) {
        imports.push(importedFilePath);
      }
    }
  });

  return imports;
}

// Build a component tree from the file system and source code
function buildComponentTree(filePath: string, baseDir: string): typeof TreeObject | null {
  const absoluteFilePath = path.resolve(baseDir, filePath);

  if (!fs.existsSync(absoluteFilePath)) {
    console.error(`File does not exist: ${absoluteFilePath}`);
    return null;
  }

  const ast = parseFileToAST(absoluteFilePath); // line 9
  
  // Determine the component type (functional or class)
  const {type, stateVariables } = findComponentTypeAndState(ast); //line 36
  
  // Find imports to identify child components
  const imports = findImportsInAST(ast); //line 92

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
    .filter((child): child is typeof TreeObject => Boolean(child)); // Remove any null values

  // Return just the file name and the component type
  return {
    file: path.basename(filePath),  // Return the file name instead of full path
    type: type,  // Return the component type (class or functional)
    state: stateVariables,
    children: children // Remove any invalid entries
  };
}

module.exports = { buildComponentTree };