import Constants from 'expo-constants';

type AppExtra = {
  API_BASE_URL?: string;
  GOOGLE_ANDROID_CLIENT_ID?: string;
  GOOGLE_IOS_CLIENT_ID?: string;
  GOOGLE_WEB_CLIENT_ID?: string;
  EXPO_PUBLIC_ENV?: string;
  eas?: { projectId?: string };
};

const extra = (Constants.expoConfig?.extra ?? {}) as AppExtra;

export const ENV = {
  apiBaseUrl: extra.API_BASE_URL ?? '',
  googleAndroidClientId: extra.GOOGLE_ANDROID_CLIENT_ID ?? '',
  googleIosClientId: extra.GOOGLE_IOS_CLIENT_ID ?? '',
  googleWebClientId: extra.GOOGLE_WEB_CLIENT_ID ?? '',
  env: extra.EXPO_PUBLIC_ENV ?? 'dev',
  easProjectId: extra.eas?.projectId ?? '',
};


