import { useAuthStore } from '@/stores/auth';
import { useGoogleAuth } from '@/utils/googleAuth';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Divider, Text, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { G, Path } from 'react-native-svg';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { promptAsync } = useGoogleAuth((token, profile) => {
    login(token, { id: 'google', email: profile.email, name: profile.name });
    router.replace('/home');
  });
  const insets = useSafeAreaInsets();

  const GoogleLogo = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <G>
        <Path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <Path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <Path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <Path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </G>
    </Svg>
  );

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      setError('Chưa kết nối backend. Vui lòng liên hệ admin.');
    } catch (e) {
      setError('Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#F5F3FF' }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 0 }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text variant="headlineSmall">Chào mừng trở lại!</Text>
            <Text variant="bodyMedium" style={{ color: '#6b7280' }}>
              Đăng nhập để tiếp tục
            </Text>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 0,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              borderColor: '#E9D5FF',
              paddingHorizontal: 16,
              paddingTop: 24,
              paddingBottom: Math.max(insets.bottom, 12) + 12,
              width: '100%',
              alignSelf: 'stretch',
              minHeight: 400,
            }}
          >
            {!!error && (
              <View style={{ backgroundColor: '#fef2f2', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <Text variant="bodySmall" style={{ color: '#dc2626', textAlign: 'center' }}>
                  {error}
                </Text>
              </View>
            )}

            <View style={{ marginBottom: 16 }}>
              <Text variant="labelLarge" style={{ marginBottom: 8 }}>
                Email
              </Text>
              <TextInput
                mode="outlined"
                placeholder="Nhập email của bạn"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text variant="labelLarge" style={{ marginBottom: 8 }}>
                Mật khẩu
              </Text>
              <TextInput
                mode="outlined"
                placeholder="Nhập mật khẩu"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                right={
                  <TextInput.Icon
                    icon={() => (
                      <Ionicons
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color="#666"
                      />
                    )}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </View>

            <Button mode="contained" onPress={onSubmit} disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>

            <View style={{ alignItems: 'center', marginVertical: 16 }}>
              <Divider style={{ alignSelf: 'stretch' }} />
              <Text style={{ color: '#6b7280', marginVertical: 8 }}>hoặc</Text>
              <Divider style={{ alignSelf: 'stretch' }} />
            </View>

            <Button 
              mode="outlined" 
              onPress={() => promptAsync()} 
              style={{ marginBottom: 16 }}
              icon={() => <GoogleLogo />}
            >
              Đăng nhập với Google
            </Button>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ color: '#6b7280' }}>
                Chưa có tài khoản?{' '}
              </Text>
              <Link href="/auth/register">
                <Text style={{ color: '#3b82f6', fontWeight: '600' }}>Đăng ký ngay</Text>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

