const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  js.configs.recommended, // ESLint's recommended JavaScript rules
  {
    files: ['**/*.{ts,tsx}'], // Applies to TypeScript files
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest', // Latest ECMAScript version
      sourceType: 'module',  // Use ES Modules
      globals: {
        console: 'readonly', // Define `console` as a global variable (read-only)
        window: 'readonly',  // Define `window` as a global variable (for browser)
        document: 'readonly', // Define `document` as a global variable (for browser)
        process: 'readonly',  // Define `process` as a global variable (for Node.js)
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin, // TypeScript plugin
    },
    rules: {
      // Define TypeScript-specific rules
      "no-unused-vars": 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
