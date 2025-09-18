import { Button, Dialog, Text } from 'react-native-paper';

interface DialogLogoutProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}

export function DialogLogout({
  visible,
  onDismiss,
  onConfirm,
}: DialogLogoutProps) {
  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      style={{ backgroundColor: 'white' }}
    >
      <Dialog.Icon icon="logout" size={40} color="#f87171" />
      <Dialog.Title style={{ textAlign: 'center' }}>
        Xác nhận đăng xuất
      </Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
          Bạn có chắc chắn muốn đăng xuất ?
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Hủy</Button>
        <Button
          mode="contained"
          buttonColor="#f87171"
          onPress={onConfirm}
          style={{ marginLeft: 8 }}
        >
          Đăng xuất
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
