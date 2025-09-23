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
import { getInfoAdmin, googleLogin, login } from '@@/services/admin/admin';
import { useAppStore } from '@@/stores/appStore';
import axiosInstance from '@@/utils/axiosInstance';
import { signInWithGoogle } from '@@/utils/googleSignIn';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentUser } = useAppStore();

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

          try {
            const userInfo = await getInfoAdmin();
            setCurrentUser(userInfo?.data || null);
            router.replace('/home');
          } catch (userError: any) {
            console.log('Get user info error:', userError);
            if (userError.response?.data?.errorCode === 'ROLE_NOT_MATCHED') {
              setError(
                'Tài khoản của bạn không có quyền truy cập ứng dụng này. Vui lòng liên hệ quản trị viên để được hỗ trợ !',
              );
            } else if (userError.response?.data?.errorDescription) {
              setError(userError.response.data.errorDescription);
            } else {
              setError('Không thể lấy thông tin người dùng. Vui lòng thử lại.');
            }
            // Clear token nếu có lỗi
            await AsyncStorage.removeItem('token');
            delete axiosInstance.defaults.headers.common['Authorization'];
          }
        }
      } else {
        // Xử lý khi statusCode không phải 201
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (e: any) {
      console.log('Login error:', e);
      if (
        e.response?.data?.errorCode === '401' &&
        e.response?.data?.errorDescription ===
          'Invalid credentials or email not verified'
      ) {
        setError(
          'Thông tin đăng nhập không đúng hoặc email chưa được xác thực. Vui lòng kiểm tra lại.',
        );
      } else if (e.response?.data?.errorDescription) {
        setError(e.response.data.errorDescription);
      } else if (e.response?.data?.message) {
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

  // Xử lý đăng nhập Google
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError(null);

      const result = await signInWithGoogle();

      if (result.success && result.idToken) {
        await handleGoogleAuthSuccess(result);
      } else {
        setError(result.error || 'Đăng nhập với Google thất bại');
      }
    } catch (e: any) {
      setError(e.message || 'Đăng nhập với Google thất bại. Vui lòng thử lại.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle successful Google authentication
  const handleGoogleAuthSuccess = async (authData: {
    idToken?: string;
    accessToken?: string;
  }) => {
    try {
      setError(null);

      if (!authData || !authData.idToken) {
        throw new Error('Không thể lấy ID token từ Google');
      }

      // Call backend API with ID token
      const response: any = await googleLogin({
        idToken: authData.idToken,
      });

      if (response?.statusCode === 201 && response?.data?.accessToken) {
        // Save the token
        await AsyncStorage.setItem('token', response.data.accessToken);

        // Set authorization header
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${response.data.accessToken}`;

        try {
          // Get user info
          const userInfo = await getInfoAdmin();
          setCurrentUser(userInfo?.data || null);

          // Navigate to home screen
          router.replace('/home');
        } catch (userError: any) {
          console.log('Get user info error:', userError);
          if (userError.response?.data?.errorCode === 'ROLE_NOT_MATCHED') {
            setError(
              'Tài khoản của bạn không có quyền truy cập ứng dụng này. Vui lòng liên hệ quản trị viên để được hỗ trợ !',
            );
          } else if (userError.response?.data?.errorDescription) {
            setError(userError.response.data.errorDescription);
          } else {
            setError('Không thể lấy thông tin người dùng. Vui lòng thử lại.');
          }
          // Clear token nếu có lỗi
          await AsyncStorage.removeItem('token');
          delete axiosInstance.defaults.headers.common['Authorization'];
        }
      } else {
        setError('Đăng nhập với Google thất bại. Vui lòng thử lại sau.');
      }
    } catch (e: any) {
      console.log('Google Auth processing error:', e);
      if (e.response?.data?.errorDescription) {
        setError(e.response.data.errorDescription);
      } else if (e.response?.data?.message) {
        setError(e.response.data.message);
      } else if (e.message) {
        setError(e.message);
      } else {
        setError('Đăng nhập với Google thất bại. Vui lòng thử lại sau.');
      }
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

        <Button
          mode="contained"
          onPress={onSubmit}
          disabled={loading || googleLoading}
        >
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>

        <DividerWithText text="hoặc" />

        <Button
          mode="outlined"
          style={{ marginBottom: 16 }}
          icon={() => <GoogleLogo />}
          onPress={handleGoogleSignIn}
          loading={googleLoading}
          disabled={loading || googleLoading}
        >
          {googleLoading ? 'Đang xử lý...' : 'Đăng nhập với Google'}
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
