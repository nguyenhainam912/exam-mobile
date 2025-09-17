import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <View
      style={{
        backgroundColor: '#fef2f2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      <Text
        variant="bodySmall"
        style={{ color: '#dc2626', textAlign: 'center' }}
      >
        {message}
      </Text>
    </View>
  );
}
