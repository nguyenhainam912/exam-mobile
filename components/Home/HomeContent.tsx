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
  return (
    <View style={styles.container}>
      <UserCard name="Nguyễn Hải Nam" className="Lớp 3" />
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
