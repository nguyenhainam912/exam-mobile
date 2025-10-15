import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import QuestionForm from './QuestionForm';

// Sử dụng interface có sẵn từ services

interface QuestionsSectionProps {
  questions: any[]; // Sử dụng any[] từ Exam.Record.questions
  errors: { [key: string]: string };
  onQuestionChange: (questionId: string, field: string, value: any) => void;
  onAnswerChange: (questionId: string, answerId: string, text: string) => void;
  onCorrectAnswerChange: (questionId: string, answerId: string) => void;
  onAddQuestion: () => void;
  onDeleteQuestion: (questionId: string) => void;
}

const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  questions,
  errors,
  onQuestionChange,
  onAnswerChange,
  onCorrectAnswerChange,
  onAddQuestion,
  onDeleteQuestion,
}) => {
  return (
    <Card style={styles.card}>
      <Card.Title title="Câu hỏi" titleStyle={styles.cardTitle} />
      <Card.Content>
        {questions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.
            </Text>
          </View>
        ) : (
          questions.map((question, index) => (
            <QuestionForm
              key={question.id}
              question={question}
              questionIndex={index}
              errors={errors}
              onQuestionChange={onQuestionChange}
              onAnswerChange={onAnswerChange}
              onCorrectAnswerChange={onCorrectAnswerChange}
              onDeleteQuestion={onDeleteQuestion}
              canDelete={questions.length > 1}
            />
          ))
        )}

        <Button
          mode="outlined"
          onPress={onAddQuestion}
          style={styles.addButton}
          icon="plus"
        >
          Thêm câu hỏi
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
  },
  addButton: {
    marginTop: 16,
  },
});

export default QuestionsSection;
