const tsconfig = require('./tsconfig.test.json');
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  roots: ['<rootDir>/src'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
    'node_modules/(react-dnd|dnd-core|@react-dnd|react-dnd-html5-backend|react-dnd-test-utils|react-dnd-test-backend)/.+\\.(j|t)sx?$': 'ts-jest',
    '.+\\.(gif|png|jpg|svg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(somePkg)|react-dnd|dnd-core|@react-dnd|react-dnd-html5-backend|react-dnd-test-utils|react-dnd-test-backend)',
  ],
  setupFilesAfterEnv: ['dotenv/config', '<rootDir>/setupTests'],
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': 'identity-obj-proxy',
    'config/TableauWidgets.config': '<rootDir>/src/__mocks__/tableauConfigMock.js',
    'config/TableauDataset.config': '<rootDir>/src/__mocks__/tableauConfigMock.js',
    'config/TableauDashboard.config': '<rootDir>/src/__mocks__/tableauConfigMock.js',
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/src',
    }),
  },
  modulePathIgnorePatterns: ['__mocks__'],
  coveragePathIgnorePatterns: ['.stories.tsx'],
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx', '!**/*.json'],
  coverageThreshold: {
    global: {
      branches: 63,
      functions: 37,
      lines: 47,
    },
  },
};
