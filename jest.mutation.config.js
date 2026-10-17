module.exports = {
  preset: 'jest-expo',
  testTimeout: 10000,
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@apps4craft/.*)',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/core/**/*.test.ts',
    '**/tests/curing-*.test.ts',
  ],
};
