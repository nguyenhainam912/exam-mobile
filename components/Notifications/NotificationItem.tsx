import { StyleSheet, View } from 'react-native';
import { Badge, Card, IconButton, Text } from 'react-native-paper';

interface Notification {
  _id: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  user: string;
  type?: string;
  link?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
}

export default function NotificationItem({
  notification,
  onPress,
}: NotificationItemProps) {
  // Xác định icon dựa trên loại thông báo
  const getNotificationIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'announcement':
        return 'bullhorn';
      case 'assignment':
        return 'book-open-page-variant';
      case 'event':
        return 'calendar';
      case 'alert':
        return 'alert-circle';
      case 'info':
        return 'information';
      default:
        return 'bell';
    }
  };

  // Format thời gian
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Cùng ngày
      if (date.toDateString() === now.toDateString()) {
        if (diffMinutes < 60) {
          return `${diffMinutes} phút trước`;
        } else {
          return `${diffHours} giờ trước`;
        }
      }

      // Trong vòng 7 ngày
      if (diffDays < 7) {
        return `${diffDays} ngày trước`;
      }

      // Cùng năm
      if (date.getFullYear() === now.getFullYear()) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return `Ngày ${day} tháng ${month}`;
      }

      // Khác năm
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card
      style={[
        styles.card,
        notification.isRead ? styles.readCard : styles.unreadCard,
      ]}
      onPress={onPress}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <IconButton
            icon={getNotificationIcon(notification.type)}
            size={24}
            iconColor="#8B5CF6"
            style={styles.icon}
          />
          {!notification.isRead && <Badge size={8} style={styles.badge} />}
        </View>

        <View style={styles.contentContainer}>
          <Text
            variant="titleMedium"
            style={[
              styles.title,
              notification.isRead ? styles.readText : styles.unreadText,
            ]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>

          <Text variant="bodyMedium" style={styles.content} numberOfLines={2}>
            {notification.content}
          </Text>

          <Text variant="bodySmall" style={styles.time}>
            {formatTime(notification.createdAt)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#F5EEFF',
  },
  readCard: {
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 8,
  },
  icon: {
    backgroundColor: '#F3E8FF',
    margin: 0,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 4,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  unreadText: {
    color: '#1F2937',
    fontWeight: '700',
  },
  readText: {
    color: '#4B5563',
  },
  content: {
    color: '#6B7280',
    marginBottom: 8,
  },
  time: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});
