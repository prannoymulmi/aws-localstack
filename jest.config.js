/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'js' +
  '   collectCoverage: true,\n' +
  '    coverageDirectory: \'coverage\',\n' +
  '    collectCoverageFrom: [\n' +
  '        \'src/**/*.{ts,tsx}\',\n' +
  '        \'!src/**/*.d.ts\',\n' +
  '    ],x', 'json', 'node'],
};