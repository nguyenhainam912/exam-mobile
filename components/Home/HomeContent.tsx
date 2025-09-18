import { useAppStore } from '@@/stores/appStore';
import { StyleSheet, View } from 'react-native';
import { FeatureGrid } from './FeatureGrid';
import { UserCard } from './UserCard';

// Dữ liệu tĩnh cho các tính năng
const features = [
  {
    key: 'diemdanh',
    label: 'Điểm danh\ncho con',
    color: '#3B82F6',
    icon: 'account-group',
  },
  {
    key: 'nghihoc',
    label: 'Đơn xin\nnghỉ học',
    color: '#F59E42',
    icon: 'file-document-edit',
  },
  {
    key: 'thoikhoabieu',
    label: 'Thời khoá\nbiểu',
    color: '#22C55E',
    icon: 'calendar-clock',
  },
  {
    key: 'thucdon',
    label: 'Thực đơn\ncủa bé',
    color: '#8B5CF6',
    icon: 'clipboard-list',
  },
];

export function HomeContent() {
  // Lấy currentUser từ store
  const { currentUser } = useAppStore();

  // Tên và lớp mặc định trong trường hợp không có dữ liệu
  const userName = currentUser?.fullName || 'Chưa cập nhật';

  // Giả sử có trường className trong currentUser, nếu không thì dùng default
  const userClass = currentUser?.className || 'Chưa cập nhật';

  return (
    <View style={styles.container}>
      <UserCard
        name={userName}
        className={userClass}
        avatar={currentUser?.avatar}
      />
      <FeatureGrid features={features} />
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F5F3FF',
  },
  spacer: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
});
