import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Appbar,
  Button,
  Card,
  Divider,
  HelperText,
  List,
  Modal,
  Portal,
  Searchbar, // Thêm import
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Import services
import { getExamTypes } from '@@/services/examType/examType';
import { getGradeLevels } from '@@/services/gradeLevel/gradeLevel';
import { getSubjects } from '@@/services/subject/subject';

interface SelectItem {
  _id: string;
  name: string;
  code?: string;
}

function CreateExamScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    subjectId: '',
    gradeLevelId: '',
    examTypeId: '',
  });

  const [selectedItems, setSelectedItems] = useState({
    subject: null as SelectItem | null,
    gradeLevel: null as SelectItem | null,
    examType: null as SelectItem | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    'subject' | 'gradeLevel' | 'examType'
  >('subject');
  const [modalData, setModalData] = useState<SelectItem[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data cache
  const [subjects, setSubjects] = useState<SelectItem[]>([]);
  const [gradeLevels, setGradeLevels] = useState<SelectItem[]>([]);
  const [examTypes, setExamTypes] = useState<SelectItem[]>([]);

  // Fetch initial data
  useEffect(() => {
    fetchAllData(); // Tạm comment để debug
  }, []);

  const fetchAllData = async () => {
    try {
      const [subjectsRes, gradeLevelsRes, examTypesRes] = await Promise.all([
        getSubjects({ page: 1, limit: 100 }),
        getGradeLevels({ page: 1, limit: 100 }),
        getExamTypes({ page: 1, limit: 100 }),
      ]);

      const subjectsData = subjectsRes?.data?.result || [];
      const gradeLevelsData = gradeLevelsRes?.data?.result || [];
      const examTypesData = examTypesRes?.data?.result || [];

      // Map chỉ lấy _id và name để đảm bảo cấu trúc
      const mappedSubjects = subjectsData.map((s: any) => ({
        _id: s._id,
        name: s.name,
      }));
      const mappedGradeLevels = gradeLevelsData.map((g: any) => ({
        _id: g._id,
        name: g.name,
      }));
      const mappedExamTypes = examTypesData.map((e: any) => ({
        _id: e._id,
        name: e.name,
      }));

      setSubjects(mappedSubjects);
      setGradeLevels(mappedGradeLevels);
      setExamTypes(mappedExamTypes);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể tải dữ liệu. Vui lòng thử lại!',
        position: 'bottom',
      });
      console.error('ERROR fetchAllData:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // helper để hiển thị nhãn dễ hiểu
  const formatDurationLabel = (value: string) => {
    const num = Number(value);
    if (isNaN(num) || num <= 0) return '';
    const h = Math.floor(num / 60);
    const m = num % 60;
    if (h > 0) return `${h} giờ ${m} phút`;
    return `${m} phút`;
  };

  const openModal = (type: 'subject' | 'gradeLevel' | 'examType') => {
    setModalType(type);
    setSearchQuery('');

    let data: SelectItem[] = [];
    switch (type) {
      case 'subject':
        data = subjects;
        break;
      case 'gradeLevel':
        data = gradeLevels;
        break;
      case 'examType':
        data = examTypes;
        break;
    }

    setModalData(data);
    setModalVisible(true);
  };

  const handleSelectItem = (item: SelectItem) => {
    const field =
      modalType === 'subject'
        ? 'subjectId'
        : modalType === 'gradeLevel'
        ? 'gradeLevelId'
        : 'examTypeId';

    setFormData((prev) => ({ ...prev, [field]: item._id }));
    setSelectedItems((prev) => ({ ...prev, [modalType]: item }));

    // Clear error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }

    setModalVisible(false);
  };

  const getFilteredData = () => {
    // Đảm bảo modalData luôn là array
    const data = modalData || [];

    if (!searchQuery) return data;

    return data.filter(
      (item) =>
        item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item?.code &&
          item.code.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'subject':
        return 'Chọn môn học';
      case 'gradeLevel':
        return 'Chọn khối lớp';
      case 'examType':
        return 'Chọn loại đề thi';
      default:
        return 'Chọn';
    }
  };

  const getButtonText = (type: 'subject' | 'gradeLevel' | 'examType') => {
    const item = selectedItems[type];
    if (item) return item.name;

    switch (type) {
      case 'subject':
        return 'Chọn môn học';
      case 'gradeLevel':
        return 'Chọn khối lớp';
      case 'examType':
        return 'Chọn loại đề thi';
      default:
        return 'Chọn';
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề đề thi là bắt buộc';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Thời gian làm bài là bắt buộc';
    } else {
      const durationNum = Number(formData.duration);
      if (isNaN(durationNum) || durationNum <= 0) {
        newErrors.duration = 'Thời gian phải là số nguyên dương lớn hơn 0';
      } else if (durationNum > 1440) {
        // 24 giờ = 1440 phút
        newErrors.duration = 'Thời gian không được vượt quá 1440 phút (24 giờ)';
      }
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'Vui lòng chọn môn học';
    }

    if (!formData.gradeLevelId) {
      newErrors.gradeLevelId = 'Vui lòng chọn khối lớp';
    }

    if (!formData.examTypeId) {
      newErrors.examTypeId = 'Vui lòng chọn loại đề thi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Call API to create exam
      console.log('Creating exam with data:', {
        ...formData,
        duration: Number(formData.duration),
      });

      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Tạo đề thi thành công!',
        position: 'bottom',
      });

      // Navigate back or to next step
      router.back();
    } catch (error) {
      console.error('Error creating exam:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Có lỗi xảy ra khi tạo đề thi!',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredData = getFilteredData();

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Tạo đề thi mới" />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.card}>
            <Card.Title
              title="Thông tin cơ bản"
              titleStyle={styles.cardTitle}
            />
            <Card.Content>
              {/* Tiêu đề đề thi */}
              <TextInput
                label="Tiêu đề đề thi *"
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                mode="outlined"
                style={[styles.input, styles.roundedInput]}
                error={!!errors.title}
                left={<TextInput.Icon icon="text-box" />}
                outlineColor="#5C28EBFF" // viền bình thường (nhạt)
                activeOutlineColor="#7C3AED" // viền khi focus (tím đậm)
                outlineStyle={{ borderRadius: 12 }} // bo tròn viền của Paper
              />
              <HelperText type="error" visible={!!errors.title}>
                {errors.title}
              </HelperText>

              {/* Mô tả */}
              <TextInput
                label="Mô tả"
                value={formData.description}
                onChangeText={(value) =>
                  handleInputChange('description', value)
                }
                mode="outlined"
                multiline
                numberOfLines={3}
                style={[
                  styles.input,
                  styles.roundedInput,
                  { marginBottom: 32 },
                ]} // Thêm marginBottom để bù cho việc không có HelperText
                left={<TextInput.Icon icon="text" />}
                outlineColor="#5C28EBFF" // viền bình thường (nhạt)
                activeOutlineColor="#7C3AED" // viền khi focus (tím đậm)
                outlineStyle={{ borderRadius: 12 }} // bo tròn viền của Paper
              />

              {/* Thời gian làm bài */}
              <TextInput
                label="Thời gian làm bài (phút) *"
                value={formData.duration}
                onChangeText={(value) => {
                  // Chỉ cho phép nhập số
                  const numericValue = value.replace(/[^0-9]/g, '');
                  handleInputChange('duration', numericValue);
                }}
                mode="outlined"
                style={[styles.input, styles.roundedInput]}
                error={!!errors.duration}
                keyboardType="numeric"
                left={<TextInput.Icon icon="clock-outline" />}
                right={
                  formData.duration ? (
                    <TextInput.Affix
                      text={
                        formatDurationLabel(formData.duration)
                          ? `(${formatDurationLabel(formData.duration)})`
                          : 'phút'
                      }
                    />
                  ) : null
                }
                outlineColor="#5C28EBFF"
                activeOutlineColor="#7C3AED"
                outlineStyle={{ borderRadius: 12 }}
              />
              <HelperText type="error" visible={!!errors.duration}>
                {errors.duration}
              </HelperText>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title title="Phân loại" titleStyle={styles.cardTitle} />
            <Card.Content>
              {/* Môn học */}
              <Text variant="labelLarge" style={styles.label}>
                Môn học *
              </Text>
              <Button
                mode="outlined"
                onPress={() => openModal('subject')}
                style={[
                  styles.selectButton,
                  errors.subjectId && styles.errorButton, // This can return "" (empty string)
                ]}
                contentStyle={styles.buttonContent}
                icon="chevron-down"
              >
                {getButtonText('subject')}
              </Button>
              <HelperText type="error" visible={!!errors.subjectId}>
                {errors.subjectId}
              </HelperText>

              {/* Khối lớp */}
              <Text variant="labelLarge" style={styles.label}>
                Khối lớp *
              </Text>
              <Button
                mode="outlined"
                onPress={() => openModal('gradeLevel')}
                style={[
                  styles.selectButton,
                  errors.gradeLevelId && styles.errorButton,
                ]}
                contentStyle={styles.buttonContent}
                icon="chevron-down"
              >
                {getButtonText('gradeLevel')}
              </Button>
              <HelperText type="error" visible={!!errors.gradeLevelId}>
                {errors.gradeLevelId}
              </HelperText>

              {/* Loại đề thi */}
              <Text variant="labelLarge" style={styles.label}>
                Loại đề thi *
              </Text>
              <Button
                mode="outlined"
                onPress={() => openModal('examType')}
                style={[
                  styles.selectButton,
                  errors.examTypeId && styles.errorButton,
                ]}
                contentStyle={styles.buttonContent}
                icon="chevron-down"
              >
                {getButtonText('examType')}
              </Button>
              <HelperText type="error" visible={!!errors.examTypeId}>
                {errors.examTypeId}
              </HelperText>
            </Card.Content>
          </Card>

          {/* Action buttons */}
          <Surface style={styles.actionSurface} elevation={1}>
            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={styles.cancelButton}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={loading}
              disabled={loading}
              icon="plus"
            >
              Tạo đề thi
            </Button>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Selection Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          dismissable={true} // allow tap outside to dismiss
          contentContainerStyle={styles.modalContainer} // changed
        >
          <Surface style={styles.modalSurface} elevation={5}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              {getModalTitle()}
            </Text>

            <Divider />

            <Searchbar
              placeholder="Tìm kiếm..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />

            {/* Thay ScrollView bằng FlatList để render ổn định */}
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item._id}
              style={styles.modalList}
              contentContainerStyle={{ paddingBottom: 24 }}
              extraData={selectedItems[modalType]} // đảm bảo rerender khi chọn
              renderItem={({ item }) => (
                <List.Item
                  title={item.name}
                  onPress={() => handleSelectItem(item)}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon={
                        selectedItems[modalType]?._id === item._id
                          ? 'check-circle'
                          : 'circle-outline'
                      }
                    />
                  )}
                  style={
                    selectedItems[modalType]?._id === item._id &&
                    styles.selectedItem
                  }
                />
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchQuery
                      ? 'Không tìm thấy kết quả'
                      : 'Không có dữ liệu'}
                  </Text>
                </View>
              )}
            />

            <Divider />

            <View style={styles.modalActions}>
              <Button onPress={() => setModalVisible(false)}>Đóng</Button>
            </View>
          </Surface>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    marginTop: 16,
  },
  selectButton: {
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  errorButton: {
    borderColor: '#B91C1C',
    borderWidth: 1,
  },
  buttonContent: {
    justifyContent: 'flex-start',
  },
  actionSurface: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Tăng padding
  },
  modalSurface: {
    width: '100%', // Tăng từ 95% lên 100%
    maxWidth: 500, // Giảm maxWidth để phù hợp mobile
    minHeight: 400, // Thêm minHeight
    maxHeight: '80%',
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  modalTitle: {
    textAlign: 'center',
    padding: 16,
    fontWeight: 'bold', // Thêm để title nổi bật hơn
  },
  searchBar: {
    margin: 16,
    marginTop: 8,
  },
  modalList: {
    flex: 1,
    minHeight: 200, // Thêm minHeight cho list
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
  },
  selectedItem: {
    backgroundColor: '#EDE9FE',
  },
  modalActions: {
    padding: 16,
    alignItems: 'flex-end',
  },
  roundedInput: {
    borderRadius: 12,
  },
});

export default CreateExamScreen;
