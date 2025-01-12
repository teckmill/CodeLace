import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    plugins: {
      jest
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  },
  {
    ignores: ['dist/', 'node_modules/', 'coverage/']
  }
);
