import { getSubjects } from '@@/services/subject/subject';
import { useAppStore } from '@@/stores/appStore';
import { useRouter } from 'expo-router'; // Thêm import này
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FeatureGrid } from './FeatureGrid';
import { UserCard } from './UserCard';

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

// Hàm lấy màu sắc dựa trên code môn học
const getColorByCode = (code: string): string => {
  const colorMap: { [key: string]: string } = {
    TOAN_HOC: '#3C77F7FF', // Xanh dương đậm - logic, chính xác
    TIENG_ANH: '#07C787FF', // Xanh ngọc - giao tiếp, hội nhập
    LICH_SU: '#B45309', // Nâu vàng đồng - cổ kính, thời gian
    VAT_LY: '#5F22ECFF', // Tím xanh indigo - khoa học, khám phá
    HOA_HOC: '#DB2777', // Hồng đậm - phản ứng, thí nghiệm
    SINH_HOC: '#16A34A', // Xanh lá - sự sống, tự nhiên
    DIA_LY: '#0EA5E9', // Xanh da trời - hành tinh, đại dương
    GD_KINH_TE_PHAP_LUAT: '#DC2626', // Đỏ - nghiêm túc, luật lệ
    TIN_HOC: '#9333EA', // Tím - công nghệ, sáng tạo
    CONG_NGHE: '#F59E0B', // Vàng cam - chế tạo, kỹ thuật
  };

  return colorMap[code] || '#64748B'; // fallback color (gray)
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
  const router = useRouter(); // Thêm router
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
        const subjectFeatures = activeSubjects.map((subject) => ({
          key: subject._id,
          label: subject.name,
          color: getColorByCode(subject.code), // Màu sắc dựa trên code môn học
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

  // Thêm features cho các chức năng quản lý đề thi
  const managementFeatures = [
    {
      key: 'create-exam',
      label: 'Thêm mới',
      color: '#10B981', // Green
      icon: 'plus-circle',
      action: 'create-exam',
    },
    {
      key: 'upload-exam',
      label: 'Tải file',
      color: '#3B82F6', // Blue
      icon: 'cloud-upload',
      action: 'upload-exam',
    },
    {
      key: 'ai-exam',
      label: 'Tạo đề bằng AI ',
      color: '#C341FFFF', // Purple
      icon: 'robot',
      action: 'ai-exam',
    },
  ];

  // Hàm xử lý khi nhấn vào chức năng
  const handleManagementFeature = (action: string) => {
    console.log('Selected management feature:', action);
    // TODO: Implement navigation hoặc actions cho từng chức năng
    switch (action) {
      case 'create-exam':
        // Navigate to create exam screen
        console.log('Navigate to create exam');
        break;
      case 'upload-exam':
        // Navigate to upload exam screen
        console.log('Navigate to upload exam');
        break;
      case 'ai-exam':
        // Navigate to AI exam creation screen
        console.log('Navigate to AI exam creation');
        break;
      default:
        break;
    }
  };

  const handleSubjectPress = (subjectId: string) => {
    const subject = features.find((f) => f.subjectId === subjectId);

    const subjectName = subject?.label || 'Đề thi';

    const navigationPath = `/exams/${subjectId}?subjectName=${encodeURIComponent(
      subjectName,
    )}`;

    try {
      router.push(navigationPath as any);
    } catch (error) {
      console.log('🔴 Navigation error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <UserCard
        name={userName}
        className={userClass}
        avatar={currentUser?.avatar}
      />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Chức năng quản lý */}
        <FeatureGrid
          features={managementFeatures}
          loading={false}
          title="Chức năng"
          onFeaturePress={handleManagementFeature}
        />

        {/* Môn học */}
        <FeatureGrid
          features={features}
          loading={loading}
          title="Đề thi theo môn"
          onFeaturePress={handleSubjectPress} // Thêm dòng này
        />

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F5F3FF',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20, // Thêm padding bottom để tránh bị cắt
  },
  spacer: {
    height: 50, // Thay đổi từ flex: 1 thành height cố định
    backgroundColor: '#F5F3FF',
  },
});
