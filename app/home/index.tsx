import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomHeader } from '../../components/Header/CustomHeader';
import { HomeContent } from '../../components/Home/HomeContent';
import { getNotification } from '../../services/Notification/Notification';
import { socket } from '../../services/socket';
import { useAppStore } from '../../stores/appStore';

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser } = useAppStore();
  const [unreadCount, setUnreadCount] = useState(0);

  // Hàm lấy số lượng thông báo chưa đọc
  const fetchUnreadCount = useCallback(async () => {
    if (!currentUser?.userId) return;

    try {
      const response = await getNotification({
        page: 1,
        limit: 1,
        cond: {
          user: currentUser.userId,
          isRead: false,
        },
      });

      const total = response?.data?.total || 0;
      setUnreadCount(total);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  }, [currentUser?.userId]);

  // Sử dụng useFocusEffect để cập nhật khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
      return () => {};
    }, [fetchUnreadCount]),
  );

  // Lắng nghe socket để cập nhật realtime
  useEffect(() => {
    if (!currentUser?.userId) return;

    socket.emit('join-notification-room', currentUser.userId);

    const handleNewNotification = () => {
      fetchUnreadCount();
    };

    socket.on('new-notification', handleNewNotification);

    return () => {
      socket.off('new-notification', handleNewNotification);
      socket.emit('leave-notification-room', currentUser.userId);
    };
  }, [currentUser?.userId, fetchUnreadCount]);

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
