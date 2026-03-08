export default {
  expo: {
    name: 'CBI - Cellular Biology Intelligence',
    slug: 'cbi-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    jsEngine: 'hermes',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#1e3a8a',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.cbi.dowdprotocol',
      jsEngine: 'jsc',
      infoPlist: {
        NSCameraUsageDescription:
          'This app needs access to your camera to take photos of your meals for analysis.',
        NSPhotoLibraryUsageDescription:
          'This app needs access to your photo library to select meal photos for analysis.',
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#1e3a8a',
      },
      package: 'com.cbi.dowdprotocol',
      permissions: [
        'android.permission.CAMERA',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.RECORD_AUDIO',
      ],
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'expo-camera',
        {
          cameraPermission:
            'Allow CBI to access your camera to take photos of your meals.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'Allow CBI to access your photos to select meal images for analysis.',
        },
      ],
    ],
    extra: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
      eas: {
        projectId: 'f9613b42-7190-42a9-bd60-1c4b7746f893',
      },
    },
  },
};
