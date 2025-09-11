import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  // const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const onSubmit = async () => {
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      setLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      setError('Chưa kết nối backend. Vui lòng liên hệ admin.');
    } catch (e) {
      setError('Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={{
          uri: 'https://i.pinimg.com/1200x/d5/49/9f/d5499f6b50aacb71e313815d279b73cc.jpg',
        }}
        style={{ flex: 1, width: '100%', height: '100%' }}
        resizeMode="cover"
        imageStyle={{ opacity: 0.25 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              paddingHorizontal: 0,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text
                variant="displaySmall"
                style={{ color: '#8B5CF6', fontWeight: 'bold' }}
              >
                Đăng ký
              </Text>
              <Text variant="bodyMedium" style={{ color: '#6b7280' }}>
                Tạo tài khoản mới để bắt đầu
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
                minHeight: 500,
              }}
            >
              {!!error && (
                <View
                  style={{
                    backgroundColor: '#fef2f2',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                >
                  <Text
                    variant="bodySmall"
                    style={{ color: '#dc2626', textAlign: 'center' }}
                  >
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

              <View style={{ marginBottom: 16 }}>
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

              <View style={{ marginBottom: 20 }}>
                <Text variant="labelLarge" style={{ marginBottom: 8 }}>
                  Nhập lại mật khẩu
                </Text>
                <TextInput
                  mode="outlined"
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  right={
                    <TextInput.Icon
                      icon={() => (
                        <Ionicons
                          name={showConfirmPassword ? 'eye' : 'eye-off'}
                          size={20}
                          color="#666"
                        />
                      )}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  }
                />
              </View>

              <Button
                mode="contained"
                onPress={onSubmit}
                disabled={loading}
                style={{ marginBottom: 16 }}
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </Button>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: '#6b7280' }}>Đã có tài khoản? </Text>
                <Link href="/auth/login">
                  <Text style={{ color: '#3b82f6', fontWeight: '600' }}>
                    Đăng nhập ngay
                  </Text>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
