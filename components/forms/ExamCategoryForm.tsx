import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import ErrorHelperText from '../ui/ErrorHelperText';

interface SelectItem {
  _id: string;
  name: string;
  code?: string;
}

interface ExamCategoryFormProps {
  selectedItems: {
    subject: SelectItem | null;
    gradeLevel: SelectItem | null;
    examType: SelectItem | null;
  };
  errors: { [key: string]: string };
  onOpenModal: (type: 'subject' | 'gradeLevel' | 'examType') => void;
}

const ExamCategoryForm: React.FC<ExamCategoryFormProps> = ({
  selectedItems,
  errors,
  onOpenModal,
}) => {
  const getButtonText = (type: 'subject' | 'gradeLevel' | 'examType') => {
    const item = selectedItems[type];
    if (item) return item.name;

    switch (type) {
      case 'subject':
        return 'Chọn môn học';
      case 'gradeLevel':
        return 'Chọn khối lớp';
      case 'examType':
        return 'Chọn loại đề thi';
      default:
        return 'Chọn';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Title title="Phân loại" titleStyle={styles.cardTitle} />
      <Card.Content>
        {/* Môn học */}
        <Text variant="labelLarge" style={styles.label}>
          Môn học *
        </Text>
        <Button
          mode="outlined"
          onPress={() => onOpenModal('subject')}
          style={[styles.selectButton, errors.subjectId && styles.errorButton]}
          contentStyle={styles.buttonContent}
          icon="chevron-down"
        >
          {getButtonText('subject')}
        </Button>
        <ErrorHelperText error={errors.subjectId} />

        {/* Khối lớp */}
        <Text variant="labelLarge" style={styles.label}>
          Khối lớp *
        </Text>
        <Button
          mode="outlined"
          onPress={() => onOpenModal('gradeLevel')}
          style={[
            styles.selectButton,
            errors.gradeLevelId && styles.errorButton,
          ]}
          contentStyle={styles.buttonContent}
          icon="chevron-down"
        >
          {getButtonText('gradeLevel')}
        </Button>
        <ErrorHelperText error={errors.gradeLevelId} />

        {/* Loại đề thi */}
        <Text variant="labelLarge" style={styles.label}>
          Loại đề thi *
        </Text>
        <Button
          mode="outlined"
          onPress={() => onOpenModal('examType')}
          style={[styles.selectButton, errors.examTypeId && styles.errorButton]}
          contentStyle={styles.buttonContent}
          icon="chevron-down"
        >
          {getButtonText('examType')}
        </Button>
        <ErrorHelperText error={errors.examTypeId} />
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
  label: {
    marginBottom: 8,
    marginTop: 16,
  },
  selectButton: {
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  errorButton: {
    borderColor: '#B91C1C',
    borderWidth: 1,
  },
  buttonContent: {
    justifyContent: 'flex-start',
  },
});

export default ExamCategoryForm;
