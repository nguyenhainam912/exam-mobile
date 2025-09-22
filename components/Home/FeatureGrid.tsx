import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { FeatureButton } from './FeatureButton';

interface Feature {
  key: string;
  label: string;
  color: string;
  icon: string;
  subjectId?: string;
  description?: string;
  code?: string;
  isActive?: boolean;
}

interface FeatureGridProps {
  features: Feature[];
  title?: string;
  loading?: boolean;
}

export function FeatureGrid({
  features,
  title = 'Đề thi theo môn',
  loading = false,
}: FeatureGridProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Đang tải môn học...</Text>
        </View>
      ) : features.length > 0 ? (
        <View style={styles.grid}>
          {features.map((item) => (
            <FeatureButton
              key={item.key}
              label={item.label}
              icon={item.icon}
              color={item.color}
              onPress={() => {
                // TODO: Navigate to subject detail or exam list
                console.log('Subject selected:', item);
              }}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có môn học nào</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F3FF',
  },
  title: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },
});
