import { AuthContainer } from '@@/components/auth/AuthContainer';
import { AuthFooter } from '@@/components/auth/AuthFooter';
import { AuthHeader } from '@@/components/auth/AuthHeader';
import { FormInput } from '@@/components/auth/FormInput';
import { GoogleLogo } from '@@/components/auth/GoogleLogo';
import { ErrorMessage } from '@@/components/common/ErrorMessage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode, useState } from 'react';
import { View } from 'react-native';
import { Button, Divider, Text, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Import thêm các module cần thiết
import { login } from '@@/services/admin/admin';
import axiosInstance from '@@/utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    // Validate inputs
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: any = await login(
        {
          email,
          password,
        },
        { skipErrorHandler: true },
      );

      if (response?.statusCode === 201) {
        if (response?.data?.accessToken === '') {
          setError(
            'Tài khoản của bạn đã hết hạn. Vui lòng gia hạn để sử dụng chức năng!',
          );
          return;
        } else if (response?.data?.accessToken) {
          await AsyncStorage.setItem('token', response.data.accessToken);

          axiosInstance.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${response.data.accessToken}`;

          // TODO: Lấy thông tin người dùng nếu cần
          // const userInfo = await getInfoAdmin();
          // Lưu thông tin user nếu cần

          // Chuyển hướng đến trang home sau khi đăng nhập thành công
          router.replace('/home');
        }
      } else {
        // Xử lý khi statusCode không phải 201
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (e: any) {
      console.log('Login error:', e);
      if (e.response?.data?.message) {
        setError(e.response.data.message);
      } else if (e.message) {
        setError(e.message);
      } else {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer backgroundImage={require('@@/assets/images/bg-login.jpg')}>
      <AuthHeader title="Chào mừng trở lại!" subtitle="Đăng nhập để tiếp tục" />

      <FormContainer>
        {!!error && <ErrorMessage message={error} />}

        <FormInput
          label="Email"
          placeholder="Nhập email của bạn"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <FormInput
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          rightIcon={
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

        <Button mode="contained" onPress={onSubmit} disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>

        <DividerWithText text="hoặc" />

        <Button
          mode="outlined"
          style={{ marginBottom: 16 }}
          icon={() => <GoogleLogo />}
        >
          Đăng nhập với Google
        </Button>

        <AuthFooter
          message="Chưa có tài khoản?"
          linkText="Đăng ký ngay"
          linkHref="/auth/register"
        />
      </FormContainer>
    </AuthContainer>
  );
}

interface FormContainerProps {
  children: ReactNode;
}

function FormContainer({ children }: FormContainerProps) {
  const insets = useSafeAreaInsets();

  return (
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
      {children}
    </View>
  );
}

interface DividerWithTextProps {
  text: string;
}

function DividerWithText({ text }: DividerWithTextProps) {
  return (
    <View style={{ alignItems: 'center', marginVertical: 16 }}>
      <Divider style={{ alignSelf: 'stretch' }} />
      <Text style={{ color: '#6b7280', marginVertical: 8 }}>{text}</Text>
      <Divider style={{ alignSelf: 'stretch' }} />
    </View>
  );
}
