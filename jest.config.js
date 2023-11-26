
module.exports = {
  roots: ['<rootDir>/src/__tests__'],
  resetMocks: true,
  moduleNameMapper: {
    '~/(.*)$': '<rootDir>/src/__tests__/$1'
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['js', 'ts'],
  testTimeout: 300 * 1000, // 5 mins
  // globalSetup: '<rootDir>/src/core/global-setup.ts'
  moduleFileExtensions: [
    "ts",
    "js",
    "json",
    "node"
  ],
  collectCoverage: true
}
