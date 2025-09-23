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
  action?: string; // Thêm property này
}

interface FeatureGridProps {
  features: Feature[];
  title?: string;
  loading?: boolean;
  onFeaturePress?: (action: string) => void; // Thêm prop mới
}

export function FeatureGrid({
  features,
  title = 'Đề thi theo môn',
  loading = false,
  onFeaturePress,
}: FeatureGridProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  if (features.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có dữ liệu</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>
        {features.map((feature) => (
          <FeatureButton
            key={feature.key}
            label={feature.label}
            color={feature.color}
            icon={feature.icon}
            onPress={() => {
              console.log('🔵 FeatureButton pressed:', feature);

              if (onFeaturePress) {
                if (feature.action) {
                  onFeaturePress(feature.action);
                } else if (feature.subjectId) {
                  onFeaturePress(feature.subjectId);
                } else {
                  onFeaturePress(feature.key);
                }
              } else {
                console.log('🔴 onFeaturePress is not provided');
              }
            }}
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
