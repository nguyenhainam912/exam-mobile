import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import {
  Card,
  IconButton,
  RadioButton,
  Text,
  TextInput,
} from 'react-native-paper';
import MathRenderer from '../ui/MathRenderer';

interface QuestionFormProps {
  question: any;
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
  const [editingField, setEditingField] = useState<string | null>(null);
  const tapCountRef = useRef<{
    [key: string]: { count: number; timeout: number | null };
  }>({});
  const blurTimeoutRef = useRef<number | null>(null);

  // Xử lý double tap
  const handleTap = useCallback((fieldId: string) => {
    if (!tapCountRef.current[fieldId]) {
      tapCountRef.current[fieldId] = { count: 0, timeout: null };
    }

    const tapData = tapCountRef.current[fieldId];

    if (tapData.timeout) {
      clearTimeout(tapData.timeout);
    }

    tapData.count += 1;

    if (tapData.count === 2) {
      // Double tap - vào edit mode
      setEditingField(fieldId);
      tapData.count = 0;
      tapData.timeout = null;
    } else {
      // Single tap - chờ tap thứ 2
      tapData.timeout = window.setTimeout(() => {
        tapData.count = 0;
        tapData.timeout = null;
      }, 300);
    }
  }, []);

  const handleQuestionTap = useCallback(() => {
    handleTap(`question-${question.id}`);
  }, [question.id, handleTap]);

  const handleAnswerTap = useCallback(
    (answerId: string) => {
      handleTap(`answer-${answerId}`);
    },
    [handleTap],
  );

  // Focus - set editing field và cancel blur timeout
  const handleQuestionFocus = useCallback(() => {
    // Cancel blur timeout nếu có
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setEditingField(`question-${question.id}`);
  }, [question.id]);

  const handleAnswerFocus = useCallback((answerId: string) => {
    // Cancel blur timeout nếu có
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setEditingField(`answer-${answerId}`);
  }, []);

  // Blur - CHỈ clear sau một khoảng delay (để đợi xem có focus lại không)
  const handleQuestionBlur = useCallback(() => {
    // Chỉ blur nếu có nội dung
    if (question.question_text) {
      // Delay 100ms trước khi blur thật sự
      blurTimeoutRef.current = window.setTimeout(() => {
        setEditingField((current) => {
          // Chỉ clear nếu đang edit câu hỏi này
          if (current === `question-${question.id}`) {
            return null;
          }
          return current;
        });
        blurTimeoutRef.current = null;
      }, 100);
    }
  }, [question.id, question.question_text]);

  const handleAnswerBlur = useCallback(
    (answerId: string) => {
      // Tìm answer để kiểm tra có text không
      const answer = question.answers?.find((a: any) => a.id === answerId);

      // Chỉ blur nếu có nội dung
      if (answer && answer.answer_text) {
        // Delay 100ms trước khi blur thật sự
        blurTimeoutRef.current = window.setTimeout(() => {
          setEditingField((current) => {
            // Chỉ clear nếu đang edit câu trả lời này
            if (current === `answer-${answerId}`) {
              return null;
            }
            return current;
          });
          blurTimeoutRef.current = null;
        }, 100);
      }
    },
    [question.answers],
  );

  const isQuestionEditing = editingField === `question-${question.id}`;
  const isAnswerEditing = (answerId: string) =>
    editingField === `answer-${answerId}`;

  // Hiển thị input nếu: CHƯA có text HOẶC đang edit
  const shouldShowQuestionInput = !question.question_text || isQuestionEditing;
  const shouldShowAnswerInput = (answer: any) =>
    !answer.answer_text || isAnswerEditing(answer.id);

  return (
    <Card style={styles.questionCard}>
      <Card.Content>
        <View style={styles.questionHeader}>
          <View style={styles.inputWrapper}>
            {shouldShowQuestionInput ? (
              <TextInput
                label={`Câu hỏi ${questionIndex + 1}`}
                value={question.question_text}
                onChangeText={(text) =>
                  onQuestionChange(question.id, 'question_text', text)
                }
                onFocus={handleQuestionFocus}
                onBlur={handleQuestionBlur}
                style={styles.input}
                mode="outlined"
                multiline
                error={!!errors[`question_${question.id}`]}
                autoFocus={isQuestionEditing}
                outlineColor="#E5E7EB"
                activeOutlineColor="#8B5CF6"
                outlineStyle={styles.inputOutline}
                contentStyle={styles.inputContent}
                theme={{
                  colors: {
                    primary: '#8B5CF6',
                  },
                  roundness: 12,
                }}
              />
            ) : (
              <TouchableWithoutFeedback onPress={handleQuestionTap}>
                <View style={styles.mathPreviewClickable}>
                  <Text style={styles.label}>Câu hỏi {questionIndex + 1}</Text>
                  <MathRenderer
                    content={question.question_text}
                    fontSize={14}
                    color="#1F2937"
                  />
                  <Text style={styles.doubleTapHint}>
                    Nhấn đúp để chỉnh sửa
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
          {canDelete && (
            <IconButton
              icon="delete"
              size={20}
              iconColor="#EF4444"
              onPress={() => onDeleteQuestion(question.id)}
            />
          )}
        </View>

        {errors[`question_${question.id}`] && (
          <Text style={styles.errorText}>
            {errors[`question_${question.id}`]}
          </Text>
        )}

        <View style={styles.answersContainer}>
          {question.answers?.map((answer: any, answerIndex: number) => (
            <View key={answer.id} style={styles.answerRow}>
              <RadioButton
                value={answer.id}
                status={answer.is_correct ? 'checked' : 'unchecked'}
                onPress={() => onCorrectAnswerChange(question.id, answer.id)}
                color="#8B5CF6"
              />
              <View style={styles.answerInputContainer}>
                {shouldShowAnswerInput(answer) ? (
                  <TextInput
                    label={`Câu trả lời ${answerIndex + 1}`}
                    value={answer.answer_text}
                    onChangeText={(text) =>
                      onAnswerChange(question.id, answer.id, text)
                    }
                    onFocus={() => handleAnswerFocus(answer.id)}
                    onBlur={() => handleAnswerBlur(answer.id)}
                    style={styles.answerInput}
                    mode="outlined"
                    multiline
                    error={!!errors[`answer_${answer.id}`]}
                    autoFocus={isAnswerEditing(answer.id)}
                    outlineColor="#E5E7EB"
                    activeOutlineColor="#8B5CF6"
                    outlineStyle={styles.inputOutline}
                    contentStyle={styles.inputContent}
                    theme={{
                      colors: {
                        primary: '#8B5CF6',
                      },
                      roundness: 12,
                    }}
                  />
                ) : (
                  <TouchableWithoutFeedback
                    onPress={() => handleAnswerTap(answer.id)}
                  >
                    <View style={styles.mathPreviewClickable}>
                      <Text style={styles.label}>
                        Câu trả lời {answerIndex + 1}
                      </Text>
                      <MathRenderer
                        content={answer.answer_text}
                        fontSize={13}
                        color="#374151"
                      />
                      <Text style={styles.doubleTapHint}>
                        Nhấn đúp để chỉnh sửa
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}

                {errors[`answer_${answer.id}`] && (
                  <Text style={styles.errorText}>
                    {errors[`answer_${answer.id}`]}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputOutline: {
    borderRadius: 12,
  },
  inputContent: {
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  mathPreviewClickable: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    minHeight: 56,
  },
  doubleTapHint: {
    fontSize: 10,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'right',
  },
  answersContainer: {
    marginTop: 8,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  answerInputContainer: {
    flex: 1,
  },
  answerInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
});

export default QuestionForm;
