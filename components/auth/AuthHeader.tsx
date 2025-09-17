import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 48,
      }}
    >
      <Text variant="headlineSmall">{title}</Text>
      {subtitle && (
        <Text variant="bodyMedium" style={{ color: '#6b7280' }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
