import { Button, Dialog, Text } from 'react-native-paper';

interface DialogHelpProps {
  visible: boolean;
  onDismiss: () => void;
}

export function DialogHelp({ visible, onDismiss }: DialogHelpProps) {
  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      style={{ backgroundColor: 'white' }}
    >
      <Dialog.Icon icon="help-circle" size={40} color="#8B5CF6" />
      <Dialog.Title style={{ textAlign: 'center' }}>
        Trung tâm trợ giúp
      </Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>Câu hỏi thường gặp:</Text>
        </Text>

        <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>
            1. Làm sao để cập nhật thông tin cá nhân?
          </Text>
          {'\n'}Bạn có thể nhấn vào nút "Chỉnh sửa hồ sơ" ở trang Cá nhân để cập
          nhật thông tin.
        </Text>

        <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>2. Làm sao để tải đề thi?</Text>
          {'\n'}Ở trang Trang chủ, bạn có thể nhấn vào chức năng "Đề thi" và tải
          xuống.
        </Text>

        <Text variant="bodyMedium">
          <Text style={{ fontWeight: 'bold' }}>
            3. Làm sao để đổi mật khẩu?
          </Text>
          {'\n'}Vui lòng liên hệ với nhà trường để được hỗ trợ đổi mật khẩu.
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Đóng</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
