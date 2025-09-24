import { GradeLevelRecord } from '@@/stores/gradeLevel';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Checkbox, Dialog, Portal, Text } from 'react-native-paper';

interface GradeLevelFilterDialogProps {
  visible: boolean;
  onDismiss: () => void;
  gradeLevels: GradeLevelRecord[];
  selectedGradeLevels: string[];
  tempSelectedGradeLevels: string[];
  loadingGradeLevels: boolean;
  onGradeLevelToggle: (gradeLevelId: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  onCancel: () => void;
}

export function GradeLevelFilterDialog({
  visible,
  onDismiss,
  gradeLevels,
  selectedGradeLevels,
  tempSelectedGradeLevels,
  loadingGradeLevels,
  onGradeLevelToggle,
  onClearFilters,
  onApplyFilters,
  onCancel,
}: GradeLevelFilterDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Lọc theo lớp học</Dialog.Title>
        <Dialog.Content>
          {loadingGradeLevels ? (
            <View style={styles.dialogLoading}>
              <ActivityIndicator size="small" color="#8B5CF6" />
              <Text style={styles.dialogLoadingText}>Đang tải...</Text>
            </View>
          ) : (
            <ScrollView style={styles.gradeLevelsList}>
              {gradeLevels.map((gradeLevel) => {
                if (!gradeLevel._id) return null;

                return (
                  <View key={gradeLevel._id} style={styles.checkboxRow}>
                    <Checkbox
                      status={
                        tempSelectedGradeLevels.includes(gradeLevel._id)
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() => onGradeLevelToggle(gradeLevel._id || '')}
                    />
                    <Text
                      style={styles.checkboxLabel}
                      onPress={() => onGradeLevelToggle(gradeLevel._id || '')}
                    >
                      {gradeLevel.name}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClearFilters}>Xóa bộ lọc</Button>
          <Button onPress={onCancel}>Hủy</Button>
          <Button onPress={onApplyFilters}>Áp dụng</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'white',
  },
  dialogLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  dialogLoadingText: {
    marginLeft: 8,
    color: '#6B7280',
  },
  gradeLevelsList: {
    maxHeight: 300,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
});