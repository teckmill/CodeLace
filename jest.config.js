/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  collectCoverageFrom: [
    'js/src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/types/'
  ]
};
