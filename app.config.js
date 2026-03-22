import 'dotenv/config';

export default {
  expo: {
    name: 'Mido App',
    slug: 'mido-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: false,
    jsEngine: 'hermes',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#1e3a8a',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.mido.app',
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
      package: 'com.mido.app',
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
            'Allow Mido to access your camera to take photos of your meals.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'Allow Mido to access your photos to select meal images for analysis.',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'f9613b42-7190-42a9-bd60-1c4b7746f893',
      },
      // API Configuration
      apiUrl: process.env.API_URL || 'https://cbi-app-production.up.railway.app/',
      // Supabase Configuration (anon key is public/client-safe)
      supabaseUrl: process.env.SUPABASE_URL || 'https://oaudtsrxuwsrkkxfxyaf.supabase.co',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hdWR0c3J4dXdzcmtreGZ4eWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MDUyNTQsImV4cCI6MjA4NzI4MTI1NH0.vuZukHn3UqAbzFXp4yVYgfZarsAExOsDmyFhvlLz_4k',
      // Anthropic API key should only be provided via env var, never hardcoded
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    },
  },
};
