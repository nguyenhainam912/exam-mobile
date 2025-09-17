import { StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';

interface UserCardProps {
  name: string;
  className: string;
  avatarColor?: string;
}

export function UserCard({
  name,
  className,
  avatarColor = '#8B5CF6',
}: UserCardProps) {
  return (
    <View style={styles.container}>
      <Avatar.Icon
        size={48}
        icon="account"
        color="#fff"
        style={{ backgroundColor: avatarColor, marginRight: 16 }}
      />
      <View>
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.className}>Lớp: {className}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  className: {
    color: '#6b7280',
  },
});
