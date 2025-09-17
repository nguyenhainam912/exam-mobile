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
  ios: { supportsTablet: true },
  android: {
    edgeToEdgeEnabled: true,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
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
  ],
  experiments: { typedRoutes: true },
});

export default defineConfig;
