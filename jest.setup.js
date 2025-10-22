import '@testing-library/jest-native/extend-expect';

// Mock Expo import meta
global.__ExpoImportMetaRegistry = {};

// Polyfill structuredClone if not available
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock Expo modules
jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn(() =>
      Promise.resolve({ status: 'granted' })
    ),
    requestMicrophonePermissionsAsync: jest.fn(() =>
      Promise.resolve({ status: 'granted' })
    ),
  },
  CameraView: 'CameraView',
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: 'mock-image-uri' }],
    })
  ),
  launchCameraAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: 'mock-camera-image-uri' }],
    })
  ),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jest.mock('expo-barcode-scanner', () => ({
  BarCodeScanner: {
    requestPermissionsAsync: jest.fn(() =>
      Promise.resolve({ status: 'granted' })
    ),
  },
}));

// Mock React Native Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Silence console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
