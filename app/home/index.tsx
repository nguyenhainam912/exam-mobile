import { useFocusEffect } from '@react-navigation/native'; // Thêm import này
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { useAppStore } from '../../stores/appStore';

// Import các component đã tách
import { CustomHeader } from '../../components/Header/CustomHeader';
import { HomeContent } from '../../components/Home/HomeContent';
import { ProfileContent } from '../../components/Profile/ProfileContent';

// Định nghĩa các kiểu
interface Route {
  key: string;
  title: string;
  label: string;
  focusedIcon: string;
  unfocusedIcon: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser } = useAppStore();
  const [unreadCount, setUnreadCount] = useState(0);

  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    {
      key: 'home',
      title: 'Trang chủ',
      label: '',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'profile',
      title: 'Cá nhân',
      label: '',
      focusedIcon: 'account',
      unfocusedIcon: 'account-outline',
    },
  ]);

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

      // Trả về hàm cleanup nếu cần
      return () => {
        // Cleanup code nếu cần
      };
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

  // Component cho Header của Home với xử lý thông báo
  const HomeHeader = () => {
    return (
      <CustomHeader
        showLogo={true}
        showNotification={true}
        notificationCount={unreadCount}
        onNotificationPress={handleNotificationPress}
      />
    );
  };

  // Component cho Header của Profile
  const ProfileHeader = () => {
    return (
      <CustomHeader
        showLogo={false}
        backgroundImage={require('../../assets/images/bg-home.jpg')}
        imageOpacity={0.7}
        titleColor="#ffffff"
        showNotification={false}
      />
    );
  };

  // Render header dựa trên tab hiện tại
  const renderHeader = () => {
    switch (index) {
      case 0:
        return <HomeHeader />;
      case 1:
        return <ProfileHeader />;
      default:
        return <HomeHeader />;
    }
  };

  // Render scene với kiểu dữ liệu đúng
  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'home':
        return <HomeContent />;
      case 'profile':
        return <ProfileContent />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Render header dựa vào tab đang active */}
      {renderHeader()}

      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={styles.bottomBar}
        activeColor="#8B5CF6"
        inactiveColor="#6b7280"
        sceneAnimationEnabled={false}
        labeled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  bottomBar: {
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    height: 110,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
});
