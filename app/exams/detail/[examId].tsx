import { Exam } from '@@/services/exam';
import { getExamById } from '@@/services/exam/exam';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import MathRenderer - đảm bảo đường dẫn đúng
import MathRenderer from '@@/components/ui/MathRenderer';

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

        {/* Sử dụng MathRenderer cho nội dung câu hỏi */}
        <View style={styles.questionContentContainer}>
          <MathRenderer
            content={question.content || ''}
            fontSize={16}
            color="#1F2937"
          />
        </View>

        <View style={styles.optionsContainer}>
          {question?.options?.map((option: any, optionIndex: number) => (
            <View key={optionIndex} style={styles.optionItem}>
              <Text style={styles.optionLabel}>
                {String.fromCharCode(65 + optionIndex)}.
              </Text>
              <View style={styles.optionContentContainer}>
                <MathRenderer
                  content={option || ''}
                  fontSize={14}
                  color="#1F2937"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Hiển thị giải thích nếu có */}
        {question.explanation && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>Giải thích:</Text>
            <View style={styles.explanationContentContainer}>
              <MathRenderer
                content={question.explanation}
                fontSize={14}
                color="#4B5563"
              />
            </View>
          </View>
        )}

        {/* Hiển thị độ khó nếu có */}
        {question.difficulty && (
          <View style={styles.difficultyContainer}>
            <Text style={styles.difficultyLabel}>
              Độ khó: {question.difficulty}/5
            </Text>
          </View>
        )}
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
              <MathRenderer
                content={exam.title || ''}
                fontSize={20}
                color="#1F2937"
                textStyle={{ fontWeight: '700' }}
              />
            </View>

            {exam.description && (
              <View style={styles.examDescriptionContainer}>
                <MathRenderer
                  content={exam.description}
                  fontSize={16}
                  color="#4B5563"
                />
              </View>
            )}

            <Divider style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Lớp:</Text>
                <Text style={styles.infoValue}>
                  {exam.gradeLevelId?.name || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Loại đề:</Text>
                <Text style={styles.infoValue}>
                  {exam.examTypeId?.name || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Thời gian:</Text>
                <Text style={styles.infoValue}>{exam.duration} phút</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số câu hỏi:</Text>
                <Text style={styles.infoValue}>
                  {exam.questions?.length || 0}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Questions Section */}
        <View style={styles.questionsSection}>
          <Text style={styles.sectionTitle}>
            Danh sách câu hỏi ({exam.questions?.length || 0})
          </Text>
          {exam.questions?.map((question, index) =>
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
    marginBottom: 12,
    minHeight: 30,
  },
  examDescriptionContainer: {
    marginBottom: 16,
    minHeight: 25,
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
  questionContentContainer: {
    marginBottom: 16,
    minHeight: 30,
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
  optionContentContainer: {
    flex: 1,
    minHeight: 20,
  },
  explanationContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  explanationContentContainer: {
    minHeight: 20,
  },
  difficultyContainer: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  difficultyLabel: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
