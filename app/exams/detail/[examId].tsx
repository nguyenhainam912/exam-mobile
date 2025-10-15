import { Exam } from '@@/services/exam';
import { getExamById } from '@@/services/exam/exam';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExamDetailScreen() {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const router = useRouter();

  const [exam, setExam] = useState<Exam.Record | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchExamDetail = async () => {
    try {
      if (!examId) {
        console.error('Exam ID is required');
        return;
      }

      const response = await getExamById(examId);

      if (response?.statusCode === 200 && response?.data) {
        setExam(response.data);
      }
    } catch (error) {
      console.error('hiii222 exams:', error);
      console.error('Error fetching exam detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamDetail();
  }, [examId]);

  const renderQuestion = (question: any, index: number) => (
    <Card key={question._id} style={styles.questionCard}>
      <Card.Content>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>Câu {index + 1}</Text>
        </View>

        <Text style={styles.questionContent}>{question.content}</Text>

        <View style={styles.optionsContainer}>
          {question?.options.map((option: any, optionIndex: any) => (
            <View key={optionIndex} style={styles.optionItem}>
              <Text style={styles.optionLabel}>
                {String.fromCharCode(65 + optionIndex)}.
              </Text>
              <Text style={styles.optionText}>{option}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Chi tiết đề thi</Text>
          <View style={{ width: 48 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Đang tải chi tiết...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!exam) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Chi tiết đề thi</Text>
          <View style={{ width: 48 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy đề thi</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Chi tiết đề thi</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Exam Info Card */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.examTitleContainer}>
              <Text style={styles.examTitle}>{exam.title}</Text>
            </View>

            {exam.description && (
              <Text style={styles.examDescription}>{exam.description}</Text>
            )}

            <Divider style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Lớp:</Text>
                <Text style={styles.infoValue}>{exam.gradeLevelId.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Loại đề:</Text>
                <Text style={styles.infoValue}>{exam.examTypeId.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Thời gian:</Text>
                <Text style={styles.infoValue}>{exam.duration} phút</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số câu hỏi:</Text>
                <Text style={styles.infoValue}>{exam.questions.length}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Questions Section */}
        <View style={styles.questionsSection}>
          <Text style={styles.sectionTitle}>
            Danh sách câu hỏi ({exam.questions.length})
          </Text>
          {exam.questions.map((question, index) =>
            renderQuestion(question, index),
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  examTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  examTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  examDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  infoGrid: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  questionsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  questionCard: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  questionHeader: {
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  questionContent: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 8,
    minWidth: 20,
  },
  optionText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
    lineHeight: 20,
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
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});
