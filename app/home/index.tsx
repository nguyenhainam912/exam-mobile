import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomNavigation } from 'react-native-paper';

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

// Component cho Header của Home
function HomeHeader() {
  return (
    <CustomHeader
      showLogo={true}
      showNotification={true}
      notificationCount={3}
      onNotificationPress={() => console.log('Notification pressed')}
    />
  );
}

// Component cho Header của Profile
function ProfileHeader() {
  return (
    <CustomHeader
      showLogo={false}
      title="Hồ sơ cá nhân"
      backgroundImage={require('../../assets/images/bg-home.jpg')}
      imageOpacity={0.7}
      titleColor="#ffffff"
      showNotification={false}
    />
  );
}

export default function HomeScreen() {
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
