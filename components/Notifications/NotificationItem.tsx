import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

interface NotificationItemProps {
  notification: {
    _id: string;
    subject: string;
    content: string;
    isRead: boolean;
    createdAt: string;
  };
  onPress: () => void;
}

export default function NotificationItem({
  notification,
  onPress,
}: NotificationItemProps) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `Ngày ${d.getDate()} tháng ${d.getMonth() + 1}`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, !notification.isRead && styles.unreadContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <MaterialCommunityIcons
        name="bell"
        size={24}
        color={!notification.isRead ? '#8B5CF6' : '#D1D5DB'}
        style={styles.icon}
      />

      {/* Text content */}
      <View style={styles.textContent}>
        <Text style={styles.subject}>{notification.subject}</Text>
        <Text style={styles.content}>{notification.content}</Text>
        <Text style={styles.date}>{formatDate(notification.createdAt)}</Text>
      </View>

      {/* Indicator đã đọc */}
      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  unreadContainer: {
    backgroundColor: '#F3E8FF',
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textContent: {
    flex: 1,
  },
  subject: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  content: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
    marginLeft: 8,
    marginTop: 6,
  },
});
