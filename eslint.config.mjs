import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import mochaPlugin from "eslint-plugin-mocha";

export default [
  // Base configuration for all files
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    ignores: ["out/", "dist/", "node_modules/"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        // Node.js globals
        process: "readonly",
        module: "readonly",
        require: "readonly",
        // Mocha globals
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        after: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      "mocha": mochaPlugin,
    },
    rules: {
      ...typescriptPlugin.configs["recommended"].rules,
      ...mochaPlugin.configs["recommended"].rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        'varsIgnorePattern': '^__webpack_',
        'argsIgnorePattern': '^__webpack_'
      }],
      // Add any other custom rules here
    },
  },
  // Rules spiecific to certain files
  {
    "files": ["src/linterTest.ts"],
    "rules": {
      "no-var": "error"
    }
  },
  
  // Backend-specific configuration
  {
    files: ["src/server/**/*.{js,ts}", "webpack.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  // Frontend-specific configuration
  {
    files: ["src/webview/**/*.{js,ts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-var-requires": "error",  // Disallow `var require = ...`
    },
  },
  // Test file configuration
  {
    files: ["**/*.test.{js,ts,jsx,tsx}", "**/*.spec.{js,ts,jsx,tsx}"],
    rules: {
      "mocha/no-mocha-arrows": "error",
      // Any other specific rules for test files
    },
  },
];