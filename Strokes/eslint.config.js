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
    },
    plugins: {
      '@typescript-eslint': tsPlugin, // TypeScript plugin
    },
    rules: {
      // Define TypeScript-specific rules
      "no-unused-vars": 'warn',
      //"no-unused-vars": ["error", {"vars": "all", "args": "none", "ignoreRestSiblings": true}],
      //"@typescript-eslint/no-unused-vars": ["error", {"vars": "all", "args": "none", "ignoreRestSiblings": true}],
      //'@typescript-eslint/no-unused-vars': 'warn',
      //'@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

