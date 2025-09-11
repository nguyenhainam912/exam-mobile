import { useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';
import { BottomNavigation, Button, IconButton, Text } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';

const HEADER_HEIGHT = 180;
const RADIUS = 40;
const BG_IMAGE =
  'https://i.pinimg.com/736x/46/fb/d8/46fbd8de7a853f7fdb370a71753a9bd6.jpg';

function HomeContent() {
  return (
    <View style={styles.content}>
      <Text
        variant="headlineMedium"
        style={{ marginBottom: 8, color: '#8B5CF6' }}
      >
        Xin chào!
      </Text>
      <Text variant="bodyLarge" style={{ marginBottom: 24, color: '#6b7280' }}>
        Bạn đã đăng nhập thành công.
      </Text>
      <Button mode="contained" onPress={() => {}}>
        Đăng xuất
      </Button>
    </View>
  );
}

function ProfileContent() {
  return (
    <View style={styles.content}>
      <Text variant="headlineMedium" style={{ color: '#8B5CF6' }}>
        Thông tin cá nhân
      </Text>
      <Text style={{ color: '#6b7280', marginTop: 8 }}>
        Tính năng này sẽ cập nhật sau.
      </Text>
    </View>
  );
}

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
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

  const renderScene = BottomNavigation.SceneMap({
    home: HomeContent,
    profile: ProfileContent,
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <ImageBackground
          source={{ uri: BG_IMAGE }}
          style={styles.headerBg}
          imageStyle={styles.headerImage}
          resizeMode="cover"
        >
          <View style={styles.bellWrapper}>
            <IconButton
              icon="bell-outline"
              size={28}
              iconColor="#000000"
              onPress={() => {}}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
          <Svg
            width={width}
            height={20}
            viewBox={`0 0 ${width} 20`}
            style={{ position: 'absolute', bottom: -1, left: 0 }}
          >
            <Path
              d={`
    M0,16
    L${width * 0.18},16
    Q${width * 0.25},12 ${width * 0.5},2
    Q${width * 0.75},12 ${width * 0.82},16
    L${width},16
    L${width},20
    L0,20
    Z
  `}
              fill="#F5F3FF"
            />
          </Svg>
        </ImageBackground>
      </View>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{
          backgroundColor: '#fff',
          borderTopWidth: 0.5,
          borderTopColor: '#eee',
          height: 110,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflow: 'hidden',
        }}
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
  headerWrapper: {
    height: HEADER_HEIGHT,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    marginBottom: 8,
  },
  headerBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerImage: {
    opacity: 0.85,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F5F3FF',
  },
  bellWrapper: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#FF3D00',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
