import { Exam } from '@@/services/exam';
import { generateExamPdf } from '@@/services/exam/exam';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  ActivityIndicator,
  Card,
  IconButton,
  Menu,
  Text,
} from 'react-native-paper';
import Toast from 'react-native-toast-message';

interface ExamCardProps {
  exam: Exam.Record;
}

export const ExamCard = ({ exam }: ExamCardProps) => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const showToast = (
    message: string,
    type: 'success' | 'error' = 'success',
  ) => {
    Toast.show({
      type: type,
      text1: type === 'success' ? 'Thành công' : 'Lỗi',
      text2: message,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const handleDownload = async () => {
    if (!exam._id) {
      showToast('Không tìm thấy ID đề thi!', 'error');
      return;
    }

    setDownloading(true);

    try {
      const response = await generateExamPdf(exam._id);

      // Tạo tên file từ tiêu đề đề thi
      const fileName = `${
        exam.title?.replace(/[^a-zA-Z0-9\s]/g, '') || 'Đề-thi'
      }.pdf`;

      // Tạo đường dẫn file trong thư mục tạm
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Xử lý blob response
      let base64Data: string;

      if (response.data && response.data._data) {
        // Case: React Native blob response
        const blob = response.data;

        // Convert blob to base64
        const reader = new FileReader();
        base64Data = await new Promise((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            // Remove data:application/pdf;base64, prefix if exists
            const base64 = result.split(',')[1] || result;
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        // Fallback: try other formats
        console.error('Unsupported response format');
        showToast('Định dạng phản hồi không được hỗ trợ!', 'error');
        return;
      }

      // Lưu file vào thiết bị
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Kiểm tra file đã được tạo chưa
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (!fileInfo.exists) {
        showToast('Không thể tạo file PDF!', 'error');
        return;
      }

      // Chia sẻ file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Mở đề thi PDF',
        });
        showToast('Đã tải đề thi thành công!', 'success');
      } else {
        showToast('Đã tải đề thi thành công!', 'success');
      }

      // Đóng menu sau khi hoàn thành
      closeMenu();
    } catch (error: any) {
      console.error('Download error:', error);

      let errorMessage = 'Có lỗi xảy ra khi tải đề thi!';

      if (error.message?.includes('Cannot convert')) {
        errorMessage = 'Lỗi định dạng dữ liệu từ server!';
      } else if (error.response?.status === 404) {
        errorMessage = 'Đề thi không tồn tại!';
      } else if (error.response?.status === 500) {
        errorMessage = 'Lỗi server khi tạo PDF!';
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleCardPress = () => {
    router.push(`/exams/detail/${exam._id}` as any);
  };

  return (
    <Card style={styles.examCard} onPress={handleCardPress}>
      <Card.Content>
        <View style={styles.examHeader}>
          <Text style={styles.examTitle} numberOfLines={2}>
            {exam.title}
          </Text>
          <Menu
            visible={menuVisible}
            onDismiss={!downloading ? closeMenu : undefined}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={openMenu}
                disabled={downloading}
              />
            }
            contentStyle={styles.menuContent}
          >
            <View
              style={[
                styles.menuItemContainer,
                downloading && styles.menuItemContainerLoading,
              ]}
            >
              <TouchableOpacity
                onPress={handleDownload}
                disabled={downloading}
                style={styles.customMenuItem}
                activeOpacity={downloading ? 1 : 0.7}
              >
                {downloading ? (
                  <ActivityIndicator
                    size={20}
                    color="#8B5CF6"
                    style={styles.menuIcon}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="cloud-download"
                    size={20}
                    color="#8B5CF6"
                    style={styles.menuIcon}
                  />
                )}
                <Text
                  style={[
                    styles.menuItemTitle,
                    downloading && styles.menuItemTitleLoading,
                  ]}
                >
                  {downloading ? 'Đang tải xuống...' : 'Tải xuống PDF'}
                </Text>
              </TouchableOpacity>
            </View>
          </Menu>
        </View>

        {exam.description && (
          <Text style={styles.examDescription} numberOfLines={2}>
            {exam.description}
          </Text>
        )}

        <View style={styles.examInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lớp:</Text>
            <Text style={styles.infoValue}>
              {exam.gradeLevelId?.name || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Loại đề:</Text>
            <Text style={styles.infoValue}>
              {exam.examTypeId?.name || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Thời gian:</Text>
            <Text style={styles.infoValue}>{exam.duration} phút</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số câu hỏi:</Text>
            <Text style={styles.infoValue}>{exam.questions?.length || 0}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  examCard: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  examHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  examDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  examInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  menuContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    minWidth: 200,
    paddingVertical: 8,
  },
  menuItemContainer: {
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    borderWidth: 1,
    borderColor: '#C4B5FD',
    overflow: 'hidden',
  },
  menuItemContainerLoading: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  customMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B5CF6',
    letterSpacing: 0.5,
    flex: 1,
  },
  menuItemTitleLoading: {
    color: '#6B7280',
  },
});
