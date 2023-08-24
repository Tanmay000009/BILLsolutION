module.exports = {
  preset: 'ts-jest', // Informs Jest that TypeScript is being used
  testEnvironment: 'node', // Specifies Node.js as the testing environment
  testMatch: ['**/*.test.ts'], // Matches test files ending with '.test.ts'
  verbose: true, // Provides detailed output during test runs
  forceExit: true // Forces Jest to exit after all tests are complete
};
