const eslint = require('eslint');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierConfig = require('eslint-config-prettier');
const jest = require('eslint-plugin-jest');

module.exports = [
  {
    files: ['js/src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      globals: {
        browser: 'readonly',
        node: 'readonly',
        es6: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      ...prettierConfig.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    plugins: {
      jest: jest
    },
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        jest: 'readonly'
      }
    },
    rules: {
      ...jest.configs.recommended.rules
    }
  }
];
