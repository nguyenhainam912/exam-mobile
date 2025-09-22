import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

interface FeatureButtonProps {
  label: string;
  icon: string;
  color: string;
  onPress?: () => void;
}

export function FeatureButton({
  label,
  icon,
  color,
  onPress,
}: FeatureButtonProps) {
  return (
    <View style={styles.container}>
      {/* Icon với nền màu */}
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <IconButton
          icon={icon}
          size={28}
          iconColor="#fff"
          onPress={onPress}
          style={{ margin: 0 }}
        />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '22%', // 4 items per row with some margin
    marginHorizontal: '1.5%',
    marginBottom: 16,
    minHeight: 90,
  },
  iconContainer: {
    shadowColor: '#6F009BFF',
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 2, height: 6 },
    elevation: 20,
    width: 48,
    height: 48,
    borderRadius: 16,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    maxWidth: 80,
    lineHeight: 18,
  },
});
