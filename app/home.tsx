import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import { useAuthStore } from '@/stores/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  
  console.log('HomeScreen - user:', user, 'token:', token);
  
  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      router.replace('/auth/login');
    }
  }, [token, router]);
  
  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem('auth-storage-v2');
      logout();
      Alert.alert('Đã xóa storage', 'App sẽ restart');
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể xóa storage');
    }
  };
  
  // Don't render if no token
  if (!token) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xin chào {user?.name || user?.email || 'User'}</Text>
      <Text style={styles.subtitle}>Token: {token ? 'Có' : 'Không'}</Text>
      <Text style={styles.subtitle}>Token value: {token || 'null'}</Text>
      <Button title="Đăng xuất" onPress={logout} />
      <View style={{ height: 12 }} />
      <Button title="Clear Storage" onPress={clearStorage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 22, marginBottom: 16 },
  subtitle: { fontSize: 16, marginBottom: 16, color: '#666' },
});


