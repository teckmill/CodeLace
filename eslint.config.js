// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    root: true,
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      prettierConfig
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    env: {
      browser: true,
      node: true,
      es6: true
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    extends: ['plugin:jest/recommended'],
    env: {
      jest: true
    }
  }
);
