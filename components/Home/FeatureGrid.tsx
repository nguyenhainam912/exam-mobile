import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { FeatureButton } from './FeatureButton';

interface Feature {
  key: string;
  label: string;
  color: string;
  icon: string;
}

interface FeatureGridProps {
  features: Feature[];
  title?: string;
}

export function FeatureGrid({
  features,
  title = 'Chức năng',
}: FeatureGridProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.grid}>
        {features.map((item) => (
          <FeatureButton
            key={item.key}
            label={item.label}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F3FF',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
