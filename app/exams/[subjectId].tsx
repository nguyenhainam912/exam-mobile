import { GradeLevelFilterDialog } from '@@/components/ExamList/GradeLevelFilterDialog'; // Thêm import
import { Exam } from '@@/services/exam';
import { getExams } from '@@/services/exam/exam';
import { getGradeLevels } from '@@/services/gradeLevel/gradeLevel';
import { GradeLevelRecord } from '@@/stores/gradeLevel';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Card, Chip, IconButton, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExamListScreen() {
  const { subjectId, subjectName } = useLocalSearchParams<{
    subjectId: string;
    subjectName: string;
  }>();
  const router = useRouter();

  const [exams, setExams] = useState<Exam.Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  // Filter states
  const [gradeLevels, setGradeLevels] = useState<GradeLevelRecord[]>([]);
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<string[]>([]);
  const [tempSelectedGradeLevels, setTempSelectedGradeLevels] = useState<
    string[]
  >([]);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [loadingGradeLevels, setLoadingGradeLevels] = useState(false);

  const fetchGradeLevels = async () => {
    try {
      setLoadingGradeLevels(true);
      const response = await getGradeLevels({
        page: 1,
        limit: 100,
        cond: { isDeleted: false, isActive: true },
      });

      if (response?.statusCode === 200 && response?.data?.result) {
        setGradeLevels(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching grade levels:', error);
    } finally {
      setLoadingGradeLevels(false);
    }
  };

  const fetchExams = async (pageNum: number = 1, search: string = '') => {
    try {
      if (!subjectId) {
        console.error('Subject ID is required');
        return;
      }

      const cond: any = {
        subjectId: subjectId,
        isDeleted: false,
      };

      if (search.trim()) {
        cond.title = { $regex: search, $options: 'i' };
      }

      if (selectedGradeLevels.length > 0) {
        cond.gradeLevelId = { $in: selectedGradeLevels };
      }

      const response = await getExams({
        page: pageNum,
        limit: 10,
        cond,
      });

      if (response?.statusCode === 200 && response?.data?.result) {
        const newExams = response.data.result;

        if (pageNum === 1) {
          setExams(newExams);
        } else {
          setExams((prev) => [...prev, ...newExams]);
        }

        setHasMore(newExams.length === 10);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExams(1, '');
    fetchGradeLevels();
  }, [subjectId]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchExams(1, searchQuery);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchExams(page + 1, searchQuery);
    }
  };

  const handleSearch = (query: string) => {
    console.log('🔤 Search query changed:', query);
    setSearchQuery(query);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      console.log('🔍 Executing search after 3s delay:', query);
      setPage(1);
      setLoading(true);
      fetchExams(1, query);
    }, 3000);

    setSearchTimeout(newTimeout);
  };

  // Filter functions
  const handleGradeLevelToggle = (gradeLevelId: string) => {
    setTempSelectedGradeLevels((prev) => {
      if (prev.includes(gradeLevelId)) {
        return prev.filter((id) => id !== gradeLevelId);
      } else {
        return [...prev, gradeLevelId];
      }
    });
  };

  const openFilterDialog = () => {
    setTempSelectedGradeLevels(selectedGradeLevels);
    setShowFilterDialog(true);
  };

  const closeFilterDialog = () => {
    setTempSelectedGradeLevels(selectedGradeLevels);
    setShowFilterDialog(false);
  };

  const clearFilters = () => {
    setTempSelectedGradeLevels([]);
    setSelectedGradeLevels([]);
    setShowFilterDialog(false);
    setPage(1);
    setLoading(true);
    fetchExams(1, searchQuery);
  };

  const applyFilters = () => {
    setSelectedGradeLevels(tempSelectedGradeLevels);
    setShowFilterDialog(false);
    setPage(1);
    setLoading(true);
    fetchExams(1, searchQuery);
  };

  const getSelectedGradeLevelNames = () => {
    return gradeLevels
      .filter((gl) => selectedGradeLevels.includes(gl._id || ''))
      .map((gl) => gl.name)
      .join(', ');
  };

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const renderExamItem = ({ item }: { item: Exam.Record }) => (
    <Card
      style={styles.examCard}
      onPress={() => router.push(`/exams/detail/${item._id}` as any)}
    >
      <Card.Content>
        <View style={styles.examHeader}>
          <Text style={styles.examTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <IconButton
            icon="dots-vertical"
            size={20}
            onPress={() => {
              // TODO: Show options menu
            }}
          />
        </View>

        {item.description && (
          <Text style={styles.examDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.examInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lớp:</Text>
            <Text style={styles.infoValue}>{item.gradeLevelId.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Loại đề:</Text>
            <Text style={styles.infoValue}>{item.examTypeId.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Thời gian:</Text>
            <Text style={styles.infoValue}>{item.duration} phút</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số câu hỏi:</Text>
            <Text style={styles.infoValue}>{item.questions.length}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchQuery || selectedGradeLevels.length > 0
            ? 'Không tìm thấy đề thi nào'
            : 'Chưa có đề thi nào'}
        </Text>
      </View>
    );
  };

  if (loading && page === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>
            {subjectName || 'Danh sách đề thi'}
          </Text>
          <View style={{ width: 48 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Đang tải đề thi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>
          {subjectName || 'Danh sách đề thi'}
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <Searchbar
            placeholder="Tìm kiếm đề thi..."
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchbar}
          />
          <IconButton
            icon="filter-variant"
            size={24}
            style={[
              styles.filterButton,
              selectedGradeLevels.length > 0 && styles.filterButtonActive,
            ]}
            iconColor={selectedGradeLevels.length > 0 ? '#8B5CF6' : '#6B7280'}
            onPress={openFilterDialog}
          />
        </View>

        {selectedGradeLevels.length > 0 && (
          <View style={styles.filterChipsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Chip
                style={styles.filterChip}
                onClose={clearFilters}
                closeIcon="close"
              >
                Lớp: {getSelectedGradeLevelNames()}
              </Chip>
            </ScrollView>
          </View>
        )}
      </View>

      <FlatList
        data={exams}
        renderItem={renderExamItem}
        keyExtractor={(item) => item._id || ''}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      {/* Sử dụng component mới */}
      <GradeLevelFilterDialog
        visible={showFilterDialog}
        onDismiss={closeFilterDialog}
        gradeLevels={gradeLevels}
        selectedGradeLevels={selectedGradeLevels}
        tempSelectedGradeLevels={tempSelectedGradeLevels}
        loadingGradeLevels={loadingGradeLevels}
        onGradeLevelToggle={handleGradeLevelToggle}
        onClearFilters={clearFilters}
        onApplyFilters={applyFilters}
        onCancel={closeFilterDialog}
      />
    </SafeAreaView>
  );
}

// Xóa dialog styles khỏi styles chính
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchbar: {
    flex: 1,
    elevation: 0,
    backgroundColor: '#F3F4F6',
  },
  filterButton: {
    margin: 0,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#EDE9FE',
  },
  filterChipsContainer: {
    marginTop: 8,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: '#EDE9FE',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  examCard: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  examHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  examDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  examInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
