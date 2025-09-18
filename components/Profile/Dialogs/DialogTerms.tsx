import { ScrollView } from 'react-native';
import { Button, Dialog, Text } from 'react-native-paper';

interface DialogTermsProps {
  visible: boolean;
  onDismiss: () => void;
}

export function DialogTerms({ visible, onDismiss }: DialogTermsProps) {
  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      style={{ backgroundColor: 'white' }}
    >
      <Dialog.Icon icon="file-document-outline" size={40} color="#8B5CF6" />
      <Dialog.Title style={{ textAlign: 'center' }}>
        Điều khoản sử dụng
      </Dialog.Title>
      <Dialog.ScrollArea style={{ maxHeight: 400, paddingHorizontal: 16 }}>
        <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
          <Text
            variant="titleMedium"
            style={{ marginBottom: 12, fontWeight: 'bold', marginTop: 6 }}
          >
            1. Giới thiệu
          </Text>
          <Text
            variant="bodyMedium"
            style={{ marginBottom: 24, lineHeight: 20 }}
          >
            Chào mừng bạn đến với ứng dụng Exam App. Bằng việc truy cập và sử
            dụng ứng dụng này, bạn đồng ý tuân thủ và chịu ràng buộc bởi các
            điều khoản và điều kiện dưới đây.
          </Text>

          <Text
            variant="titleMedium"
            style={{ marginBottom: 12, fontWeight: 'bold' }}
          >
            2. Tài khoản người dùng
          </Text>
          <Text
            variant="bodyMedium"
            style={{ marginBottom: 24, lineHeight: 20 }}
          >
            Để sử dụng đầy đủ tính năng của ứng dụng, bạn cần tạo tài khoản. Bạn
            có trách nhiệm bảo mật thông tin tài khoản và mật khẩu. Bạn đồng ý
            thông báo ngay cho chúng tôi về bất kỳ hành vi sử dụng trái phép nào
            đối với tài khoản của bạn.
          </Text>

          <Text
            variant="titleMedium"
            style={{ marginBottom: 12, fontWeight: 'bold' }}
          >
            3. Quyền riêng tư
          </Text>
          <Text
            variant="bodyMedium"
            style={{ marginBottom: 24, lineHeight: 20 }}
          >
            Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo vệ thông
            tin cá nhân. Việc sử dụng thông tin được thu thập qua ứng dụng tuân
            theo Chính sách Bảo mật của chúng tôi.
          </Text>

          <Text
            variant="titleMedium"
            style={{ marginBottom: 12, fontWeight: 'bold' }}
          >
            4. Nội dung
          </Text>
          <Text
            variant="bodyMedium"
            style={{ marginBottom: 24, lineHeight: 20 }}
          >
            Các đề thi, bài giảng và tài liệu học tập trong ứng dụng thuộc bản
            quyền của chúng tôi hoặc các đối tác cấp phép. Bạn không được sao
            chép, phân phối, sửa đổi hoặc tạo các sản phẩm phái sinh từ nội dung
            mà không có sự cho phép bằng văn bản.
          </Text>

          <Text
            variant="titleMedium"
            style={{ marginBottom: 12, fontWeight: 'bold' }}
          >
            5. Hành vi bị cấm
          </Text>
          <Text
            variant="bodyMedium"
            style={{ marginBottom: 24, lineHeight: 20 }}
          >
            Bạn đồng ý không sử dụng ứng dụng cho bất kỳ mục đích bất hợp pháp
            nào hoặc bị cấm bởi các điều khoản này. Bạn không được phép gây hại
            đến hoạt động bình thường của ứng dụng hoặc can thiệp vào việc sử
            dụng và trải nghiệm của người dùng khác.
          </Text>

          <Text
            variant="titleMedium"
            style={{ marginBottom: 12, fontWeight: 'bold' }}
          >
            6. Thay đổi điều khoản
          </Text>
          <Text
            variant="bodyMedium"
            style={{ marginBottom: 24, lineHeight: 20 }}
          >
            Chúng tôi có quyền sửa đổi các điều khoản này vào bất kỳ lúc nào.
            Việc tiếp tục sử dụng ứng dụng sau khi thay đổi được đăng tải đồng
            nghĩa với việc bạn chấp nhận các điều khoản mới.
          </Text>

          <Text
            variant="titleMedium"
            style={{ marginBottom: 12, fontWeight: 'bold' }}
          >
            7. Liên hệ
          </Text>
          <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
            Nếu bạn có bất kỳ câu hỏi nào về Điều khoản sử dụng, vui lòng liên
            hệ với chúng tôi qua email: legal@examapp.com
          </Text>

          <Text
            variant="bodyMedium"
            style={{ marginTop: 16, fontStyle: 'italic' }}
          >
            Cập nhật lần cuối: 01/09/2025
          </Text>
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Đóng</Button>
        <Button mode="contained" onPress={onDismiss}>
          Tôi đồng ý
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
