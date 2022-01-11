/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  globalSetup: "<rootDir>/jest.setupEnv.ts",
  testTimeout: 20000,
}
