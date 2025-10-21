import React, { useCallback, useRef, useState } from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
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
  // State để track field đang edit
  const [editingField, setEditingField] = useState<string | null>(null);
  const inputRefs = useRef<{ [key: string]: RNTextInput | null }>({});

  // Ref để track trạng thái focus thực tế (không trigger re-render)
  const isFocusedRef = useRef<{ [key: string]: boolean }>({});

  // Click vào preview LaTeX -> chuyển sang edit mode và focus
  const handleQuestionPress = useCallback(() => {
    const fieldId = `question-${question.id}`;
    setEditingField(fieldId);
    isFocusedRef.current[fieldId] = true;
    // Focus vào input sau khi render
    setTimeout(() => {
      inputRefs.current[fieldId]?.focus();
    }, 100);
  }, [question.id]);

  const handleAnswerPress = useCallback((answerId: string) => {
    const fieldId = `answer-${answerId}`;
    setEditingField(fieldId);
    isFocusedRef.current[fieldId] = true;
    // Focus vào input sau khi render
    setTimeout(() => {
      inputRefs.current[fieldId]?.focus();
    }, 100);
  }, []);

  // Khi focus -> đánh dấu đang focus
  const handleQuestionFocus = useCallback(() => {
    const fieldId = `question-${question.id}`;
    isFocusedRef.current[fieldId] = true;
    setEditingField(fieldId);
  }, [question.id]);

  const handleAnswerFocus = useCallback((answerId: string) => {
    const fieldId = `answer-${answerId}`;
    isFocusedRef.current[fieldId] = true;
    setEditingField(fieldId);
  }, []);

  // Khi blur -> CHỈ thoát edit mode nếu THỰC SỰ đã blur (không còn focus)
  const handleQuestionBlur = useCallback(() => {
    const fieldId = `question-${question.id}`;
    isFocusedRef.current[fieldId] = false;

    // Chỉ clear editing nếu có nội dung và không còn focus
    if (question.question_text?.trim() && !isFocusedRef.current[fieldId]) {
      setEditingField((current) => {
        // Double check: chỉ clear nếu đang edit field này
        return current === fieldId ? null : current;
      });
    }
  }, [question.id, question.question_text]);

  // Logic GIỐNG Y HỆT handleQuestionBlur - lưu answerId và text vào closure
  const handleAnswerBlur = useCallback(
    (answerId: string) => {
      return () => {
        const fieldId = `answer-${answerId}`;
        isFocusedRef.current[fieldId] = false;

        // Tìm answer text tại thời điểm tạo callback
        const answer = question.answers?.find((a: any) => a.id === answerId);
        const answerText = answer?.answer_text;

        // Chỉ clear editing nếu có nội dung và không còn focus
        if (answerText?.trim() && !isFocusedRef.current[fieldId]) {
          setEditingField((current) => {
            // Double check: chỉ clear nếu đang edit field này
            return current === fieldId ? null : current;
          });
        }
      };
    },
    [question.answers],
  );

  // Kiểm tra field có đang edit không
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
                ref={(ref: RNTextInput | null) => {
                  inputRefs.current[`question-${question.id}`] = ref;
                }}
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
              <TouchableOpacity
                onPress={handleQuestionPress}
                activeOpacity={0.7}
              >
                <View style={styles.mathPreviewClickable}>
                  <Text style={styles.label}>Câu hỏi {questionIndex + 1}</Text>
                  <MathRenderer
                    content={question.question_text}
                    fontSize={14}
                    color="#1F2937"
                  />
                  <Text style={styles.editHint}>Nhấn để chỉnh sửa</Text>
                </View>
              </TouchableOpacity>
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
                    ref={(ref: RNTextInput | null) => {
                      inputRefs.current[`answer-${answer.id}`] = ref;
                    }}
                    label={`Câu trả lời ${answerIndex + 1}`}
                    value={answer.answer_text}
                    onChangeText={(text) =>
                      onAnswerChange(question.id, answer.id, text)
                    }
                    onFocus={() => handleAnswerFocus(answer.id)}
                    onBlur={handleAnswerBlur(answer.id)}
                    style={styles.answerInput}
                    mode="outlined"
                    multiline
                    error={!!errors[`answer_${answer.id}`]}
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
                  <TouchableOpacity
                    onPress={() => handleAnswerPress(answer.id)}
                    activeOpacity={0.7}
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
                      <Text style={styles.editHint}>Nhấn để chỉnh sửa</Text>
                    </View>
                  </TouchableOpacity>
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
  editHint: {
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
