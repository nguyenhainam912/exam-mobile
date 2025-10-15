import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  IconButton,
  Text,
  TextInput,
} from 'react-native-paper';
import ErrorHelperText from '../ui/ErrorHelperText';

// Sử dụng interface có sẵn từ services

interface QuestionFormProps {
  question: any; // Sử dụng any từ Exam.Record.questions
  questionIndex: number;
  errors: { [key: string]: string };
  onQuestionChange: (questionId: string, field: string, value: any) => void;
  onAnswerChange: (questionId: string, answerId: string, text: string) => void;
  onCorrectAnswerChange: (questionId: string, answerId: string) => void;
  onDeleteQuestion: (questionId: string) => void;
  canDelete: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  questionIndex,
  errors,
  onQuestionChange,
  onAnswerChange,
  onCorrectAnswerChange,
  onDeleteQuestion,
  canDelete,
}) => {
  const getDifficultyLabel = (value: number) => {
    const labels = ['', 'Rất dễ', 'Dễ', 'Trung bình', 'Khó', 'Rất khó'];
    return labels[value] || '';
  };

  const getDifficultyColor = (value: number) => {
    const colors = ['', '#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'];
    return colors[value] || '#757575';
  };

  const difficultyLevels = [1, 2, 3, 4, 5];

  return (
    <Card style={styles.questionCard}>
      <Card.Title
        title={`Câu hỏi ${questionIndex + 1}`}
        titleStyle={styles.cardTitle}
        right={() =>
          canDelete ? (
            <IconButton
              icon="delete"
              iconColor="#F44336"
              onPress={() => onDeleteQuestion(question.id)}
            />
          ) : null
        }
      />
      <Card.Content>
        {/* Nội dung câu hỏi */}
        <Text variant="labelLarge" style={styles.label}>
          * Nội dung câu hỏi
        </Text>
        <TextInput
          value={question.content || ''}
          onChangeText={(value) =>
            onQuestionChange(question.id, 'content', value)
          }
          mode="outlined"
          multiline
          numberOfLines={3}
          style={[styles.input, styles.roundedInput]}
          error={!!errors[`question_${question.id}_content`]}
          outlineColor="#5C28EBFF"
          activeOutlineColor="#7C3AED"
          outlineStyle={{ borderRadius: 12 }}
        />
        <ErrorHelperText error={errors[`question_${question.id}_content`]} />

        {/* Các lựa chọn */}
        <Text variant="labelLarge" style={styles.sectionLabel}>
          Các lựa chọn (A, B, C, D) * Đáp án
        </Text>

        {question.answers?.map((answer: any, index: number) => (
          <View key={answer.id} style={styles.answerContainer}>
            <View style={styles.answerRow}>
              <TextInput
                placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                value={answer.text || ''}
                onChangeText={(value) =>
                  onAnswerChange(question.id, answer.id, value)
                }
                mode="outlined"
                style={[styles.answerInput, styles.roundedInput]}
                error={!!errors[`question_${question.id}_answer_${answer.id}`]}
                outlineColor="#5C28EBFF"
                activeOutlineColor="#7C3AED"
                outlineStyle={{ borderRadius: 12 }}
              />
              <IconButton
                icon={answer.isCorrect ? 'check-circle' : 'circle-outline'}
                iconColor={answer.isCorrect ? '#4CAF50' : '#757575'}
                onPress={() => onCorrectAnswerChange(question.id, answer.id)}
                style={styles.correctButton}
              />
            </View>
            <ErrorHelperText
              error={errors[`question_${question.id}_answer_${answer.id}`]}
            />
          </View>
        ))}

        {/* Giải thích */}
        <Text variant="labelLarge" style={styles.sectionLabel}>
          Giải thích (explanation)
        </Text>
        <TextInput
          value={question.explanation || ''}
          onChangeText={(value) =>
            onQuestionChange(question.id, 'explanation', value)
          }
          mode="outlined"
          multiline
          numberOfLines={3}
          style={[styles.input, styles.roundedInput]}
          outlineColor="#5C28EBFF"
          activeOutlineColor="#7C3AED"
          outlineStyle={{ borderRadius: 12 }}
        />

        {/* Độ khó */}
        <Text variant="labelLarge" style={styles.sectionLabel}>
          Độ khó (1-5)
        </Text>
        <View style={styles.difficultyContainer}>
          <View style={styles.difficultyButtons}>
            {difficultyLevels.map((level) => (
              <Button
                key={level}
                mode={question.difficulty === level ? 'contained' : 'outlined'}
                onPress={() =>
                  onQuestionChange(question.id, 'difficulty', level)
                }
                style={[
                  styles.difficultyButton,
                  question.difficulty === level && {
                    backgroundColor: getDifficultyColor(level),
                  },
                ]}
                contentStyle={styles.buttonContent}
                labelStyle={[
                  styles.buttonLabel,
                  {
                    color:
                      question.difficulty === level
                        ? '#fff'
                        : getDifficultyColor(level),
                  },
                ]}
                compact
              >
                {level}
              </Button>
            ))}
          </View>
          <Chip
            mode="outlined"
            style={[
              styles.difficultyChip,
              { borderColor: getDifficultyColor(question.difficulty || 2) },
            ]}
            textStyle={{ color: getDifficultyColor(question.difficulty || 2) }}
          >
            {getDifficultyLabel(question.difficulty || 2)}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    marginBottom: 8,
    color: '#374151',
  },
  sectionLabel: {
    marginBottom: 8,
    marginTop: 16,
    color: '#374151',
  },
  input: {
    marginBottom: 8,
  },
  roundedInput: {
    borderRadius: 12,
  },
  answerContainer: {
    marginBottom: 8,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  answerInput: {
    flex: 1,
  },
  correctButton: {
    margin: 0,
  },
  difficultyContainer: {
    marginTop: 8,
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Chia đều khoảng cách
    gap: 4, // Giảm gap từ 8 xuống 4
    marginBottom: 12,
  },
  difficultyButton: {
    flex: 1, // Mỗi button chiếm 1/5 width
    minHeight: 36, // Chiều cao tối thiểu
    borderRadius: 8,
    marginHorizontal: 2, // Thêm margin nhỏ
  },
  buttonContent: {
    height: 36, // Chiều cao cố định
    minWidth: 0, // Bỏ minWidth mặc định
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 0,
    marginVertical: 0,
  },
  difficultyChip: {
    alignSelf: 'flex-start',
  },
});

export default QuestionForm;
