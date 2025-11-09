import 'dotenv/config';
import type { ExpoConfig } from 'expo/config';

const defineConfig = (): ExpoConfig => ({
  name: 'exam-mobile',
  slug: 'exam-mobile',
  scheme: 'exammobile',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    bundleIdentifier: 'com.anonymous.exammobile',
    supportsTablet: true,
  },
  android: {
    package: 'com.anonymous.exammobile',
    edgeToEdgeEnabled: true,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    softwareKeyboardLayoutMode: 'resize',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    '@react-native-google-signin/google-signin',
  ],
  experiments: { typedRoutes: true },
});

export default defineConfig;
