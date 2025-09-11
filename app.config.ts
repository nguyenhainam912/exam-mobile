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
  extra: {
    // Add your envs here
    API_BASE_URL: process.env.API_BASE_URL,
    GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
    GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
    GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
    EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
    // Provide eas project id if used
    eas: { projectId: process.env.EAS_PROJECT_ID },
  },
});

export default defineConfig;


