import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode, useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

// Import các component đã tách
import { AuthContainer } from '@@/components/auth/AuthContainer';
import { AuthFooter } from '@@/components/auth/AuthFooter';
import { AuthHeader } from '@@/components/auth/AuthHeader';
import { FormInput } from '@@/components/auth/FormInput';
import { ErrorMessage } from '@@/components/common/ErrorMessage';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    </AuthContainer>
  );
}

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
