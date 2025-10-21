import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

interface ActionButtonsProps {
  loading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  submitText?: string;
  cancelText?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  loading,
  onCancel,
  onSubmit,
  submitText = 'Tạo đề thi',
  cancelText = 'Hủy',
}) => {
  const handleSubmit = () => {
    onSubmit();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Button
        mode="outlined"
        onPress={handleCancel}
        disabled={loading}
        style={styles.cancelButton}
        textColor="#6B7280"
      >
        {cancelText}
      </Button>
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
        buttonColor="#8B5CF6"
      >
        {submitText}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    zIndex: 1000, // Thêm zIndex
  },
  cancelButton: {
    flex: 1,
    borderColor: '#E5E7EB',
  },
  submitButton: {
    flex: 1,
  },
});

export default ActionButtons;
