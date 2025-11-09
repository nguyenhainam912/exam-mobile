import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const BUBBLE = { size: 56, side: 12, bottom: 28, top: 12 };

export default function ChatBubble() {
  const router = useRouter();
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const last = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const x = SCREEN_W - BUBBLE.size - BUBBLE.side;
    const distanceFromBottom = SCREEN_H * 0.3;
    const y = SCREEN_H - BUBBLE.size - distanceFromBottom;
    pan.setValue({ x, y });
    last.current = { x, y };
  }, [pan]);

  const clamp = (v: number, a: number, b: number) =>
    Math.max(a, Math.min(b, v));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_e, g) =>
        Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6,
      onPanResponderGrant: () => {
        pan.setOffset(last.current);
        pan.setValue({ x: 0, y: 0 });
        setIsDragging(false);
      },
      onPanResponderMove: (e, g) => {
        if (Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4) setIsDragging(true);
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(e, g);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const curX = (pan.x as any).__getValue();
        const curY = (pan.y as any).__getValue();

        const maxX = SCREEN_W - BUBBLE.size - BUBBLE.side;
        const maxY = SCREEN_H - BUBBLE.size - BUBBLE.bottom;
        const minX = BUBBLE.side;
        const minY = BUBBLE.top;

        const tx = clamp(curX, minX, maxX);
        const ty = clamp(curY, minY, maxY);

        Animated.spring(pan, {
          toValue: { x: tx, y: ty },
          useNativeDriver: false,
          friction: 7,
        }).start(() => {
          last.current = {
            x: (pan.x as any).__getValue(),
            y: (pan.y as any).__getValue(),
          };
          setTimeout(() => setIsDragging(false), 120);
        });
      },
    }),
  ).current;

  const onPress = () => {
    if (!isDragging) router.push('/chat');
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: 0,
          top: 0,
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.bubble}
        onPress={onPress}
      >
        <MaterialCommunityIcons name="robot" size={22} color="#fff" />
        <Text style={styles.badge}>AI</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', zIndex: 999 },
  bubble: {
    width: BUBBLE.size,
    height: BUBBLE.size,
    borderRadius: BUBBLE.size / 2,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    color: '#8B5CF6',
    fontSize: 10,
    fontWeight: '700',
  },
});
