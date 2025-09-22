import { getSubjects } from '@@/services/subject/subject';
import { useAppStore } from '@@/stores/appStore';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FeatureGrid } from './FeatureGrid';
import { UserCard } from './UserCard';

// Màu sắc random cho các subject
const colors = [
  '#3B82F6', // Blue
  '#F59E42', // Orange
  '#22C55E', // Green
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6366F1', // Indigo
];

// Icons tương ứng với từng môn học theo code
const getIconByCode = (code: string): string => {
  const iconMap: { [key: string]: string } = {
    TOAN_HOC: 'function-variant',
    TIENG_ANH: 'translate',
    LICH_SU: 'history',
    VAT_LY: 'electron-framework',
    HOA_HOC: 'flask',
    SINH_HOC: 'bacteria-outline',
    DIA_LY: 'earth',
    GD_KINH_TE_PHAP_LUAT: 'scale-balance',
    TIN_HOC: 'laptop',
    CONG_NGHE: 'hammer-wrench',
  };

  return iconMap[code] || 'book-outline'; // fallback icon
};

interface Subject {
  _id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export function HomeContent() {
  // Lấy currentUser từ store
  const { currentUser } = useAppStore();

  // State để lưu features từ API
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy subjects từ API và chuyển đổi thành features
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await getSubjects({
        page: 1,
        limit: 50, // Lấy nhiều subjects
        cond: {}, // Có thể thêm điều kiện filter nếu cần
      });

      if (response?.statusCode === 200 && response?.data?.result) {
        const subjects: Subject[] = response.data.result;

        // Lọc chỉ lấy subjects active và không bị xóa
        const activeSubjects = subjects.filter(
          (subject) => subject.isActive && !subject.isDeleted,
        );

        // Chuyển đổi subjects thành features
        const subjectFeatures = activeSubjects.map((subject, index) => ({
          key: subject._id,
          label: subject.name,
          color: colors[index % colors.length], // Random màu từ array
          icon: getIconByCode(subject.code), // Icon dựa trên code môn học
          subjectId: subject._id,
          description: subject.description,
          code: subject.code,
          isActive: subject.isActive,
        }));

        setFeatures(subjectFeatures);
      } else {
        // Fallback về features mặc định nếu API lỗi
        setFeatures([]);
      }
    } catch (error: any) {
      console.error('Error fetching subjects:', error);

      // Xử lý lỗi theo format API mới
      if (error.response?.data?.errorDescription) {
        console.error('API Error:', error.response.data.errorDescription);
      } else if (error.response?.data?.message) {
        console.error('API Error:', error.response.data.message);
      }

      // Fallback về features mặc định khi có lỗi
      setFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

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
      <FeatureGrid features={features} loading={loading} />
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
