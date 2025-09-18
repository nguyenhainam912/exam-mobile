import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomHeader } from '../../components/Header/CustomHeader';
import { HomeContent } from '../../components/Home/HomeContent';
import { useAppStore } from '../../stores/appStore';

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser } = useAppStore();
  const [unreadCount, setUnreadCount] = useState(0);

  // Hàm lấy số lượng thông báo chưa đọc
  const fetchUnreadCount = async () => {
    try {
      // Đây là một ví dụ, thay thế bằng API thực tế của bạn
      // const count = await getUnreadNotificationCount(currentUser._id);
      // setUnreadCount(count);

      // Tạm thời sử dụng số lượng cố định cho ví dụ
      setUnreadCount(3);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  // Sử dụng useFocusEffect để cập nhật khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      if (currentUser?._id) {
        fetchUnreadCount();
      }
      return () => {};
    }, [currentUser]),
  );

  // Vẫn giữ useEffect để khởi tạo lần đầu
  useEffect(() => {
    if (currentUser?._id) {
      fetchUnreadCount();
    }
  }, [currentUser]);

  // Xử lý khi người dùng nhấn vào icon thông báo
  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        showLogo={true}
        showNotification={true}
        notificationCount={unreadCount}
        onNotificationPress={handleNotificationPress}
      />
      <HomeContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
});
