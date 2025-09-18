import { StyleSheet, View } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';

interface UserCardProps {
  name: string;
  className: string;
  avatar?: string; // Thêm prop avatar
}

export function UserCard({ name, className, avatar }: UserCardProps) {
  // Lấy chữ cái đầu của tên để hiển thị trong Avatar khi không có ảnh
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        {avatar ? (
          <Avatar.Image
            size={60}
            source={{ uri: avatar }}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Text
            size={60}
            label={getInitials(name)}
            color="#fff"
            style={{ backgroundColor: '#8B5CF6' }}
          />
        )}
        <View style={styles.textContainer}>
          <Text variant="headlineSmall" style={styles.name}>
            {name}
          </Text>
          <Text variant="bodyMedium" style={styles.class}>
            {className}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  avatar: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  class: {
    color: '#4B5563',
    marginTop: 4,
  },
});
