import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Lấy kích thước màn hình
const { width: screenWidth } = Dimensions.get('window');

// Định nghĩa kiểu cho các đường dẫn hợp lệ
type AppRoute = '/home' | '/profile' | '/notifications';

// Định nghĩa các kiểu
interface Route {
  key: string;
  title: string;
  label: string;
  focusedIcon: string;
  unfocusedIcon: string;
  path: AppRoute;
}

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Create a client
  const queryClient = new QueryClient();

  // Định nghĩa các routes
  const routes: Route[] = [
    {
      key: 'home',
      title: 'Trang chủ',
      label: '',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
      path: '/home',
    },
    {
      key: 'profile',
      title: 'Cá nhân',
      label: '',
      focusedIcon: 'account',
      unfocusedIcon: 'account-outline',
      path: '/profile',
    },
  ];

  // Kiểm tra xem pathname hiện tại có nằm trong các routes được định nghĩa không
  const shouldShowBottomNav = () => {
    // Hiển thị bottom nav cho các routes chính và notifications
    return (
      routes.some((route) => pathname.startsWith(route.path)) ||
      pathname === '/notifications'
    );
  };

  // Tìm index dựa vào pathname hiện tại
  const getCurrentIndex = () => {
    // Nếu đang ở màn hình notifications, không có tab nào được highlight
    if (pathname === '/notifications') {
      return -1; // Trả về giá trị không hợp lệ để không highlight tab nào
    }

    const route = routes.find((route) => pathname.startsWith(route.path));
    return route ? routes.indexOf(route) : 0;
  };

  const [index, setIndex] = useState(0);

  // Cập nhật index khi pathname thay đổi
  useEffect(() => {
    if (shouldShowBottomNav()) {
      setIndex(getCurrentIndex());
    }
  }, [pathname]);

  // Xử lý khi chuyển tab
  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
    // Sử dụng kiểu chính xác cho router.push
    router.push(routes[newIndex].path as any);
  };

  // Render scene - Quan trọng: cần trả về component tương ứng
  const renderScene = ({ route }: { route: Route }) => {
    // Chỉ render UI rỗng vì thực tế nội dung được render bởi Slot
    return <View />;
  };

  // Tự xây dựng thanh bottom navigation để kiểm soát hoàn toàn vị trí
  const renderCustomBottomNav = () => {
    return (
      <View
        style={[
          styles.customNavContainer,
          Platform.OS === 'android' && { bottom: 15 },
        ]}
      >
        <View style={styles.customNavBar}>
          {routes.map((route, i) => {
            const focused = i === index;
            const iconName = focused ? route.focusedIcon : route.unfocusedIcon;
            const color = focused ? '#8B5CF6' : '#6B7280';

            return (
              <View key={route.key} style={styles.tabButton}>
                <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons
                    name={iconName as any}
                    size={28}
                    color={color}
                  />
                </View>
                {focused && <View style={styles.activeIndicator} />}
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                  }}
                  onTouchEnd={() => handleIndexChange(i)}
                />
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // Theme cho Paper
  const paperTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#8B5CF6',
    },
  };

  // Tính toán chiều cao cho nội dung
  const contentPaddingBottom = shouldShowBottomNav() ? 80 : 0;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        <PaperProvider theme={paperTheme}>
          <View style={styles.container}>
            {/* Main content */}
            <View
              style={[styles.content, { paddingBottom: contentPaddingBottom }]}
            >
              <Slot />
            </View>

            {/* Bottom navigation */}
            {shouldShowBottomNav() && renderCustomBottomNav()}
          </View>
          <StatusBar style="auto" />
        </PaperProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  content: {
    flex: 1,
  },
  customNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'android' ? 15 : 0,
  },
  customNavBar: {
    width: Platform.OS === 'android' ? screenWidth * 0.85 : '100%',
    height: 56,
    backgroundColor: '#FFF',
    borderRadius: Platform.OS === 'android' ? 30 : 0,
    flexDirection: 'row',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },
});
