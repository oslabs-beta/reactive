// Import necessary modules for our ESLint configuration
import globals from "globals";  // Provides predefined global variables for different environments
import typescriptParser from "@typescript-eslint/parser";  // Parser that allows ESLint to understand TypeScript syntax
import typescriptPlugin from "@typescript-eslint/eslint-plugin";  // Plugin that provides TypeScript-specific linting rules
import jestPlugin from "eslint-plugin-jest";  // Plugin that provides Jest-specific linting rules

// Export the ESLint configuration as an array of objects
export default [
  // First object: Main configuration for all files
  {
    // Specify which files this configuration applies to
    // This includes JavaScript, TypeScript, and TypeScript JSX files
    files: ["**/*.{js,ts,tsx}"],

    // Set up language options for ESLint
    languageOptions: {
      // Define global variables that are allowed to be used without being defined
      // This includes globals for CommonJS, Node.js, Mocha, and Jest environments
      globals: {
        ...globals.commonjs,  // e.g., module, require
        ...globals.node,      // e.g., process, __dirname
        ...globals.mocha,     // e.g., describe, it
        ...globals.jest,      // e.g., test, expect
      },
      // Specify the ECMAScript version we're using
      ecmaVersion: 2022,
      // Indicate that we're using ECMAScript modules
      sourceType: "module",
      // Use the TypeScript parser for all files
      parser: typescriptParser,
      // Additional parsing options
      parserOptions: {
        // Enable parsing of JSX syntax
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    // Specify the plugins we're using
    // Plugins extend ESLint with additional rules and configurations
    plugins: {
      "@typescript-eslint": typescriptPlugin,  // Add TypeScript-specific rules
      "jest": jestPlugin,  // Add Jest-specific rules
    },

    // Define the linting rules
    // These rules determine what ESLint will flag as errors or warnings
    rules: {
      // Warn if someone tries to reassign a constant
      "no-const-assign": "warn",
      // Warn if 'this' is used before super() in a constructor
      "no-this-before-super": "warn",
      // Warn if an undefined variable is used
      "no-undef": "warn",
      // Warn if there's unreachable code
      "no-unreachable": "warn",
      // Turn off the base unused variables rule
      "no-unused-vars": "off",
      // Use the TypeScript-specific unused variables rule instead
      "@typescript-eslint/no-unused-vars": "warn",
      // Warn if super() is not called in a derived class constructor
      "constructor-super": "warn",
      // Warn if the type in a typeof expression is misspelled
      "valid-typeof": "warn",

      // TypeScript-specific rules
      // Warn if a function is missing a return type
      "@typescript-eslint/explicit-function-return-type": "warn",
      // Warn if the 'any' type is used
      "@typescript-eslint/no-explicit-any": "warn",

      // Jest-specific rules
      // Warn if there are disabled tests
      "jest/no-disabled-tests": "warn",
      // Error if there are focused tests (which could lead to other tests being skipped)
      "jest/no-focused-tests": "error",
      // Error if there are tests with identical titles
      "jest/no-identical-title": "error",
      // Suggest using toHaveLength() for checking length
      "jest/prefer-to-have-length": "warn",
      // Ensure that expect() is called with valid arguments
      "jest/valid-expect": "error",
    },
  },

  // Second object: Additional configuration specifically for test files
  {
    // This configuration applies to files that end with .test.js, .test.ts, .test.tsx, .spec.js, .spec.ts, or .spec.tsx
    files: ["**/*.test.{js,ts,tsx}", "**/*.spec.{js,ts,tsx}"],
    
    // Extend the recommended Jest configuration
    // This adds a set of recommended rules for Jest tests
    extends: ["plugin:jest/recommended"],
    
    // Enable the Jest environment for these files
    // This allows the use of Jest globals without having to define them
    env: {
      "jest/globals": true
    },
  }
];