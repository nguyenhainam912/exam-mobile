import { Link } from 'expo-router';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface AuthFooterProps {
  message: string;
  linkText: string;
  linkHref: string;
}

export function AuthFooter({ message, linkText, linkHref }: AuthFooterProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
      }}
    >
      <Text style={{ color: '#6b7280' }}>{message} </Text>
      <Link href={linkHref}>
        <Text style={{ color: '#3b82f6', fontWeight: '600' }}>{linkText}</Text>
      </Link>
    </View>
  );
}
