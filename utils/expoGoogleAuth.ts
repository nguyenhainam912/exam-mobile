import { AuthSessionResult } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';

// This helps with completing the authentication flow
WebBrowser.maybeCompleteAuthSession();

// Get your Google Client IDs from environment or constants
const ANDROID_CLIENT_ID =
  Constants.expoConfig?.extra?.androidGoogleClientId ||
  'YOUR_ANDROID_CLIENT_ID';
const IOS_CLIENT_ID =
  Constants.expoConfig?.extra?.iosGoogleClientId || 'YOUR_IOS_CLIENT_ID';
const WEB_CLIENT_ID =
  Constants.expoConfig?.extra?.webGoogleClientId || 'YOUR_WEB_CLIENT_ID';

/**
 * Configure Google authentication and return necessary hooks and functions
 */
export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [authResult, setAuthResult] = useState<{
    idToken?: string;
    accessToken?: string;
  } | null>(null);

  // Configure Google auth request
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleAuthResponse(response);
    } else if (response?.type === 'error') {
      setError(response.error?.message || 'Google authentication failed');
    }
  }, [response]);

  const handleGoogleAuthResponse = async (response: AuthSessionResult) => {
    if (response.type !== 'success') {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { authentication } = response;

      if (!authentication) {
        throw new Error('Failed to get authentication token');
      }

      // You can send this token to your server to authenticate the user
      const result = {
        accessToken: authentication.accessToken,
        idToken: authentication.idToken, // Send this to your backend for verification
      };

      setAuthResult(result);
      return result;
    } catch (err) {
      console.error('Google auth error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to authenticate with Google',
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      await promptAsync();
    } catch (err) {
      console.error('Google prompt error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to open Google sign-in',
      );
    }
  };

  return {
    signInWithGoogle,
    loading,
    error,
    userInfo,
    authResult,
    request,
    response,
  };
};
