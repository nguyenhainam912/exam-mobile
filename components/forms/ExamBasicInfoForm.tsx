import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, TextInput } from 'react-native-paper';
import ErrorHelperText from '../ui/ErrorHelperText';

interface ExamBasicInfoFormProps {
  formData: {
    title: string;
    description: string;
    duration: string;
  };
  errors: { [key: string]: string };
  onInputChange: (field: string, value: string) => void;
  formatDurationLabel: (value: string) => string;
}

const ExamBasicInfoForm: React.FC<ExamBasicInfoFormProps> = ({
  formData,
  errors,
  onInputChange,
  formatDurationLabel,
}) => {
  return (
    <Card style={styles.card}>
      <Card.Title title="Thông tin cơ bản" titleStyle={styles.cardTitle} />
      <Card.Content>
        {/* Tiêu đề đề thi */}
        <TextInput
          label="Tiêu đề đề thi *"
          value={formData.title}
          onChangeText={(value) => onInputChange('title', value)}
          mode="outlined"
          style={[styles.input, styles.roundedInput]}
          error={!!errors.title}
          left={<TextInput.Icon icon="text-box" />}
          outlineColor="#5C28EBFF"
          activeOutlineColor="#7C3AED"
          outlineStyle={{ borderRadius: 12 }}
        />
        <ErrorHelperText error={errors.title} />

        {/* Mô tả */}
        <TextInput
          label="Mô tả"
          value={formData.description}
          onChangeText={(value) => onInputChange('description', value)}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={[styles.input, styles.roundedInput, { marginBottom: 32 }]}
          left={<TextInput.Icon icon="text" />}
          outlineColor="#5C28EBFF"
          activeOutlineColor="#7C3AED"
          outlineStyle={{ borderRadius: 12 }}
        />

        {/* Thời gian làm bài */}
        <TextInput
          label="Thời gian làm bài (phút) *"
          value={formData.duration}
          onChangeText={(value) => {
            const numericValue = value.replace(/[^0-9]/g, '');
            onInputChange('duration', numericValue);
          }}
          mode="outlined"
          style={[styles.input, styles.roundedInput]}
          error={!!errors.duration}
          keyboardType="numeric"
          left={<TextInput.Icon icon="clock-outline" />}
          right={
            formData.duration ? (
              <TextInput.Affix
                text={
                  formatDurationLabel(formData.duration)
                    ? `(${formatDurationLabel(formData.duration)})`
                    : 'phút'
                }
              />
            ) : null
          }
          outlineColor="#5C28EBFF"
          activeOutlineColor="#7C3AED"
          outlineStyle={{ borderRadius: 12 }}
        />
        <ErrorHelperText error={errors.duration} />
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
  input: {
    marginBottom: 16,
  },
  roundedInput: {
    borderRadius: 12,
  },
});

export default ExamBasicInfoForm;
