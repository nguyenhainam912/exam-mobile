import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 100;

export interface HeaderProps {
  showLogo?: boolean;
  showNotification?: boolean;
  title?: string;
  backgroundImage?: any;
  notificationCount?: number;
  onNotificationPress?: () => void;
  logoImage?: any;
  imageOpacity?: number;
  titleColor?: string;
}

export function CustomHeader({
  showLogo = true,
  showNotification = true,
  title,
  backgroundImage = require('../../assets/images/bg-home.jpg'),
  notificationCount = 0,
  onNotificationPress = () => {},
  logoImage = require('../../assets/images/logo2.png'),
  imageOpacity = 0.85,
  titleColor = '#ffffff',
}: HeaderProps) {
  return (
    <View style={styles.headerWrapper}>
      <ImageBackground
        source={backgroundImage}
        style={styles.headerBg}
        imageStyle={{
          ...styles.headerImage,
          opacity: imageOpacity,
          resizeMode: 'cover',
        }}
        resizeMode="cover"
      >
        {/* Logo ở góc trái hoặc tiêu đề */}
        <View style={{ position: 'absolute', top: 36, left: 26, zIndex: 10 }}>
          {showLogo ? (
            <Image
              source={logoImage}
              style={{ width: 44, height: 44 }}
              resizeMode="contain"
            />
          ) : title ? (
            <Text
              style={{ fontSize: 24, fontWeight: 'bold', color: titleColor }}
            >
              {title}
            </Text>
          ) : null}
        </View>

        {/* Chuông thông báo ở góc phải */}
        {showNotification && (
          <View style={styles.bellWrapper}>
            <View>
              <IconButton
                icon="bell-outline"
                size={28}
                iconColor="#000000"
                onPress={onNotificationPress}
              />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificationCount}</Text>
                </View>
              )}
            </View>
          </View>
        )}

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
  );
}

const styles = StyleSheet.create({
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
  bellWrapper: {
    position: 'absolute',
    top: 30,
    right: 16,
    zIndex: 10,
  },
  badge: {
    position: 'absolute',
    right: 4,
    top: 10,
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
