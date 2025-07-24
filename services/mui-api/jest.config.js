module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config', 'core-js'],
  modulePathIgnorePatterns: [
    '/dist/',
    '/mdf_modules/',
    '/migrations/',
    '/seeds/',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  collectCoverageFrom: ['./src/**'],
  coverageThreshold: {
    global: {
      lines: 12,
    },
  },
};
