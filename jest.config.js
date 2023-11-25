
module.exports = {
  roots: ['<rootDir>/tests'],
  resetMocks: true,
  moduleNameMapper: {
    '~/(.*)$': '<rootDir>/tests/$1'
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
