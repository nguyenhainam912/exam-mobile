import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

interface ActionButtonsProps {
  loading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  cancelText?: string;
  submitText?: string;
  submitIcon?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  loading,
  onCancel,
  onSubmit,
  cancelText = 'Hủy',
  submitText = 'Tạo đề thi',
  submitIcon = 'plus',
}) => {
  return (
    <View style={styles.actionButtons}>
      <Button
        mode="outlined"
        onPress={onCancel}
        style={styles.cancelButton}
        disabled={loading}
      >
        {cancelText}
      </Button>
      <Button
        mode="contained"
        onPress={onSubmit}
        style={styles.submitButton}
        loading={loading}
        disabled={loading}
        icon={submitIcon}
      >
        {submitText}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default ActionButtons;
