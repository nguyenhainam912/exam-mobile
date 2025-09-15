import { useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import { Avatar, BottomNavigation, IconButton, Text } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';

const HEADER_HEIGHT = 180;

function HomeContent() {
  return (
    <View
      style={{ flex: 1, paddingHorizontal: 16, backgroundColor: '#F5F3FF' }}
    >
      {/* Block 1: Thông tin cá nhân */}
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          elevation: 2,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Avatar.Icon
          size={48}
          icon="account"
          color="#fff"
          style={{ backgroundColor: '#8B5CF6', marginRight: 16 }}
        />
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
            Nguyễn Hải Nam
          </Text>
          <Text style={{ color: '#6b7280' }}>Lớp: Lớp 3</Text>
        </View>
      </View>
      {/* Block 2: Chức năng */}
      <View
        style={{
          backgroundColor: '#F5F3FF', // Đặt màu nền giống nền tổng
        }}
      >
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Chức năng</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
          }}
        >
          {features.map((item) => (
            <View
              key={item.key}
              style={{
                alignItems: 'center',
                flex: 1,
                marginHorizontal: 10,
                minHeight: 90,
              }}
            >
              {/* Icon với nền màu */}
              <View
                style={{
                  shadowColor: '#6F009BFF', // Đen nổi bật
                  shadowOpacity: 1, // Đậm hơn
                  shadowRadius: 12, // Lan rộng hơn
                  shadowOffset: { width: 2, height: 6 }, // Đổ bóng xuống dưới
                  elevation: 20, // Android bóng rõ hơn
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor: item.color,
                  marginBottom: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <IconButton
                  icon={item.icon}
                  size={28}
                  iconColor="#fff"
                  style={{ margin: 0 }}
                />
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: '500',
                  color: '#374151',
                  maxWidth: 80,
                  lineHeight: 18,
                }}
                numberOfLines={2}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
      {/* View lấp đầy khoảng trống với màu nền F5F3FF */}
      <View style={{ flex: 1, backgroundColor: '#F5F3FF' }} />
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

const features = [
  {
    key: 'diemdanh',
    label: 'Điểm danh\ncho con',
    color: '#3B82F6', // xanh dương
    icon: 'account-group', // chọn icon phù hợp
  },
  {
    key: 'nghihoc',
    label: 'Đơn xin\nnghỉ học',
    color: '#F59E42', // cam
    icon: 'file-document-edit', // chọn icon phù hợp
  },
  {
    key: 'thoikhoabieu',
    label: 'Thời khoá\nbiểu',
    color: '#22C55E', // xanh lá
    icon: 'calendar-clock', // chọn icon phù hợp
  },
  {
    key: 'thucdon',
    label: 'Thực đơn\ncủa bé',
    color: '#8B5CF6', // tím
    icon: 'clipboard-list', // chọn icon phù hợp
  },
];

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
          source={require('@/assets/images/bg-home.jpg')}
          style={styles.headerBg}
          imageStyle={styles.headerImage}
          resizeMode="cover"
        >
          {/* Logo ở góc trái */}
          <View style={{ position: 'absolute', top: 60, left: 26, zIndex: 10 }}>
            <Image
              source={require('@/assets/images/logo2.png')}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </View>
          {/* Chuông thông báo ở góc phải */}
          <View style={styles.bellWrapper}>
            <View>
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
    right: 4, // Sát hơn vào chuông
    top: 10, // Sát hơn vào chuông
    backgroundColor: '#FF3D00',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

// Thêm hàm này ở ngoài component:
function getShadowColor(key: string) {
  switch (key) {
    case 'diemdanh':
      return '#2563EB'; // xanh dương đậm
    case 'nghihoc':
      return '#EA580C'; // cam đậm
    case 'thoikhoabieu':
      return '#15803D'; // xanh lá đậm
    case 'thucdon':
      return '#7C3AED'; // tím đậm
    default:
      return '#000';
  }
}
