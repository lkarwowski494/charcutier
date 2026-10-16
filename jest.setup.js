// Global mocks for Node / Jest environment in Apps4Brew Studio
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  AccessibilityInfo: {
    announceForAccessibility: jest.fn(),
  },
  StyleSheet: {
    create: (styles) => styles,
  },
  Platform: {
    OS: 'ios',
    select: (obj) => obj.ios || obj.default,
  },
}));

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    remove: jest.fn(),
  })),
  useAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    remove: jest.fn(),
  })),
}));

jest.mock('expo-print', () => ({
  printAsync: jest.fn().mockResolvedValue(undefined),
  printToFileAsync: jest.fn().mockResolvedValue({ uri: 'file:///tmp/label-sheet.pdf' }),
}));

jest.mock('expo-camera', () => {
  const React = require('react');
  return {
    CameraView: (props) => React.createElement('CameraView', props),
    useCameraPermissions: () => [{ granted: true }, jest.fn().mockResolvedValue({ granted: true })],
  };
});
