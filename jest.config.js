module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }], // Transpiles for the Node.js version you're using
    '@babel/preset-typescript' // Transpiles TypeScript
  ],
  testEnvironment: 'node', // Specifies Node.js as the testing environment
  testMatch: ['**/*.test.ts'], // Matches test files ending with '.test.ts'
  verbose: true, // Provides detailed output during test runs
  forceExit: true // Forces Jest to exit after all tests are complete
};
