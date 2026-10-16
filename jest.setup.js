// Global mocks for Node / Jest environment in Apps4Brew Studio
// jest-expo preset handles react-native mocks natively.
// We spy on or mock specific native utilities here if needed.


jest.mock('react-native-svg', () => {
  const React = require('react');
  const mockComponent = (name) => {
    const Component = (props) => React.createElement(name, props, props.children);
    Component.displayName = name;
    return Component;
  };
  return {
    __esModule: true,
    default: mockComponent('Svg'),
    Svg: mockComponent('Svg'),
    Circle: mockComponent('Circle'),
    Ellipse: mockComponent('Ellipse'),
    G: mockComponent('G'),
    Text: mockComponent('SvgText'),
    TSpan: mockComponent('TSpan'),
    TextPath: mockComponent('TextPath'),
    Path: mockComponent('Path'),
    Polygon: mockComponent('Polygon'),
    Polyline: mockComponent('Polyline'),
    Line: mockComponent('Line'),
    Rect: mockComponent('Rect'),
    Use: mockComponent('Use'),
    Image: mockComponent('Image'),
    Symbol: mockComponent('Symbol'),
    Defs: mockComponent('Defs'),
    LinearGradient: mockComponent('LinearGradient'),
    RadialGradient: mockComponent('RadialGradient'),
    Stop: mockComponent('Stop'),
    ClipPath: mockComponent('ClipPath'),
    Pattern: mockComponent('Pattern'),
    Mask: mockComponent('Mask'),
  };
});

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
