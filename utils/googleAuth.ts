import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { ENV } from '@/utils/env';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth(onSuccess: (token: string, profile: { email: string; name?: string }) => void) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ENV.googleAndroidClientId,
    iosClientId: ENV.googleIosClientId,
    webClientId: ENV.googleWebClientId,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const accessToken = response.authentication?.accessToken ?? '';
      // In a real app, fetch profile with access token or exchange with backend
      onSuccess(accessToken, { email: 'google@example.com', name: 'Google User' });
    }
  }, [response]);

  return { request, promptAsync };
}


