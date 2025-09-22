import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Divider,
  Portal,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';

// Import các component đã tách
import { AuthContainer } from '@@/components/auth/AuthContainer';
import { AuthFooter } from '@@/components/auth/AuthFooter';
import { AuthHeader } from '@@/components/auth/AuthHeader';
import { FormInput } from '@@/components/auth/FormInput';
import { ErrorMessage } from '@@/components/common/ErrorMessage';
import { register } from '@@/services/user/user';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

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
      const response: any = await register({
        email,
        password,
      });

      if (response?.statusCode === 201 && response?.data) {
        // Đăng ký thành công, hiển thị thông báo và chuyển về login
        setError(null);

        // Hiển thị Snackbar thông báo thành công
        setShowSuccessSnackbar(true);

        // Chuyển về màn hình login sau 2 giây
        setTimeout(() => {
          router.replace('/auth/login');
        }, 2000);
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại sau.');
      }
    } catch (e: any) {
      console.log('Register error:', e);
      if (
        e.response?.data?.errorCode === '409' &&
        e.response?.data?.errorDescription === 'Email already registered'
      ) {
        setError(
          'Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.',
        );
      } else if (e.response?.data?.errorDescription) {
        setError(e.response.data.errorDescription);
      } else if (e.response?.data?.message) {
        setError(e.response.data.message);
      } else if (e.message) {
        setError(e.message);
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      backgroundImage={{
        uri: 'https://i.pinimg.com/1200x/d5/49/9f/d5499f6b50aacb71e313815d279b73cc.jpg',
      }}
    >
      <AuthHeader title="Đăng ký" subtitle="Tạo tài khoản mới để bắt đầu" />

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

        <FormInput
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          rightIcon={
            <TextInput.Icon
              icon={() => (
                <Ionicons
                  name={showConfirmPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="#666"
                />
              )}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
        />

        <Button
          mode="contained"
          onPress={onSubmit}
          disabled={loading}
          style={{ marginBottom: 16 }}
        >
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </Button>

        <AuthFooter
          message="Đã có tài khoản?"
          linkText="Đăng nhập ngay"
          linkHref="/auth/login"
        />
      </FormContainer>

      <Portal>
        <View style={styles.snackbarContainer}>
          <Snackbar
            visible={showSuccessSnackbar}
            onDismiss={() => setShowSuccessSnackbar(false)}
            duration={2000}
            style={{
              backgroundColor: '#8B5CF6',
              borderRadius: 12,
              borderWidth: 2,
              borderColor: '#E9D5FF',
              alignSelf: 'center',
              maxWidth: '90%',
            }}
            action={{
              label: 'OK',
              onPress: () => {
                setShowSuccessSnackbar(false);
                router.replace('/auth/login');
              },
              labelStyle: { color: 'white', fontWeight: '600' },
            }}
          >
            <Text style={{ color: 'white', fontWeight: '500' }}>
              Đăng ký thành công! Vui lòng xác thực qua email để tiếp tục đăng
              nhập.
            </Text>
          </Snackbar>
        </View>
      </Portal>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  snackbarContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
});

// Tái sử dụng FormContainer từ màn Login (có thể tách ra thành component riêng)
interface FormContainerProps {
  children: ReactNode;
}

function FormContainer({ children }: FormContainerProps) {
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
        paddingBottom: 24,
        width: '100%',
        alignSelf: 'stretch',
        minHeight: 500,
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
