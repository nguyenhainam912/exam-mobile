import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Import services và types
import { Exam } from '@@/services/exam/index.d';
import { getExamTypes } from '@@/services/examType/examType';
import { getGradeLevels } from '@@/services/gradeLevel/gradeLevel';
import { getSubjects } from '@@/services/subject/subject';

// Import components
import ExamBasicInfoForm from '@@/components/forms/ExamBasicInfoForm';
import ExamCategoryForm from '@@/components/forms/ExamCategoryForm';
import QuestionsSection from '@@/components/forms/QuestionsSection';
import SelectionModal from '@@/components/modals/SelectionModal';
import ActionButtons from '@@/components/ui/ActionButtons';

interface SelectItem {
  _id: string;
  name: string;
  code?: string;
}

function CreateExamScreen() {
  const router = useRouter();

  // Sử dụng partial của Exam.Record cho form data
  const [formData, setFormData] = useState<Partial<Exam.Record>>({
    title: '',
    description: '',
    duration: 0,
    subjectId: { _id: '', name: '' },
    gradeLevelId: { _id: '', name: '' },
    examTypeId: { _id: '', name: '' },
    questions: [],
    status: 'draft',
  });

  const [selectedItems, setSelectedItems] = useState({
    subject: null as SelectItem | null,
    gradeLevel: null as SelectItem | null,
    examType: null as SelectItem | null,
  });

  const [questions, setQuestions] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    'subject' | 'gradeLevel' | 'examType'
  >('subject');
  const [modalData, setModalData] = useState<SelectItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Data cache
  const [subjects, setSubjects] = useState<SelectItem[]>([]);
  const [gradeLevels, setGradeLevels] = useState<SelectItem[]>([]);
  const [examTypes, setExamTypes] = useState<SelectItem[]>([]);

  // Fetch initial data
  useEffect(() => {
    fetchAllData();
    // Tạo câu hỏi đầu tiên
    addQuestion();
  }, []);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const createNewQuestion = () => {
    return {
      id: generateId(),
      content: '',
      answers: [
        { id: generateId(), text: '', isCorrect: false },
        { id: generateId(), text: '', isCorrect: false },
        { id: generateId(), text: '', isCorrect: false },
        { id: generateId(), text: '', isCorrect: false },
      ],
      explanation: '',
      difficulty: 2,
    };
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createNewQuestion()]);
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));

    // Clear related errors
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach((key) => {
      if (key.includes(`question_${questionId}`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  const handleQuestionChange = (
    questionId: string,
    field: string,
    value: any,
  ) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)),
    );

    // Clear error if exists
    const errorKey = `question_${questionId}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleAnswerChange = (
    questionId: string,
    answerId: string,
    text: string,
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a: any) =>
                a.id === answerId ? { ...a, text } : a,
              ),
            }
          : q,
      ),
    );

    // Clear error if exists
    const errorKey = `question_${questionId}_answer_${answerId}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleCorrectAnswerChange = (questionId: string, answerId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a: any) => ({
                ...a,
                isCorrect: a.id === answerId,
              })),
            }
          : q,
      ),
    );

    // Clear correct answer error
    const errorKey = `question_${questionId}_correct_answer`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: '' }));
    }
  };

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
    if (field === 'duration') {
      setFormData((prev) => ({ ...prev, [field]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

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
    const fieldMap = {
      subject: 'subjectId',
      gradeLevel: 'gradeLevelId',
      examType: 'examTypeId',
    };

    const field = fieldMap[modalType];

    setFormData((prev) => ({
      ...prev,
      [field]: { _id: item._id, name: item.name },
    }));

    setSelectedItems((prev) => ({ ...prev, [modalType]: item }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }

    setModalVisible(false);
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate basic info
    if (!formData.title?.trim()) {
      newErrors.title = 'Tiêu đề đề thi là bắt buộc';
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Thời gian làm bài là bắt buộc và phải lớn hơn 0';
    } else if (formData.duration > 1440) {
      newErrors.duration = 'Thời gian không được vượt quá 1440 phút (24 giờ)';
    }

    if (!formData.subjectId?._id) {
      newErrors.subjectId = 'Vui lòng chọn môn học';
    }

    if (!formData.gradeLevelId?._id) {
      newErrors.gradeLevelId = 'Vui lòng chọn khối lớp';
    }

    if (!formData.examTypeId?._id) {
      newErrors.examTypeId = 'Vui lòng chọn loại đề thi';
    }

    // Validate questions
    if (questions.length === 0) {
      newErrors.questions = 'Phải có ít nhất 1 câu hỏi';
    }

    questions.forEach((question) => {
      // Validate question content
      if (!question.content?.trim()) {
        newErrors[`question_${question.id}_content`] =
          'Nội dung câu hỏi là bắt buộc';
      }

      // Validate answers
      let hasCorrectAnswer = false;
      let emptyAnswerCount = 0;

      question.answers?.forEach((answer: any) => {
        if (!answer.text?.trim()) {
          emptyAnswerCount++;
          newErrors[`question_${question.id}_answer_${answer.id}`] =
            'Đáp án không được để trống';
        }
        if (answer.isCorrect) {
          hasCorrectAnswer = true;
        }
      });

      // Must have at least one correct answer
      if (!hasCorrectAnswer) {
        newErrors[`question_${question.id}_correct_answer`] =
          'Phải chọn ít nhất 1 đáp án đúng';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Chuẩn bị dữ liệu theo Exam.Record interface
      const examData: Partial<Exam.Record> = {
        ...formData,
        questions: questions.map((q) => ({
          content: q.content,
          answers: q.answers,
          explanation: q.explanation,
          difficulty: q.difficulty,
        })),
      };

      console.log('Creating exam with data:', examData);

      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Tạo đề thi thành công!',
        position: 'bottom',
      });

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

  // Convert formData for ExamBasicInfoForm
  const formDataForBasicInfo = {
    title: formData.title || '',
    description: formData.description || '',
    duration: formData.duration?.toString() || '',
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Tạo đề thi mới" />
      </Appbar.Header>

      {/* Content area - chiếm hết không gian còn lại */}
      <View style={styles.contentContainer}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Scroll area */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <ExamBasicInfoForm
              formData={formDataForBasicInfo}
              errors={errors}
              onInputChange={handleInputChange}
              formatDurationLabel={formatDurationLabel}
            />

            <ExamCategoryForm
              selectedItems={selectedItems}
              errors={errors}
              onOpenModal={openModal}
            />

            <QuestionsSection
              questions={questions}
              errors={errors}
              onQuestionChange={handleQuestionChange}
              onAnswerChange={handleAnswerChange}
              onCorrectAnswerChange={handleCorrectAnswerChange}
              onAddQuestion={addQuestion}
              onDeleteQuestion={deleteQuestion}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* Action buttons - cố định ở cuối tuyệt đối */}
      <View style={styles.actionContainer}>
        <ActionButtons
          loading={loading}
          onCancel={() => router.back()}
          onSubmit={handleSubmit}
        />
      </View>

      <SelectionModal
        visible={modalVisible}
        title={getModalTitle()}
        data={modalData}
        selectedItem={selectedItems[modalType]}
        searchQuery={searchQuery}
        onDismiss={() => setModalVisible(false)}
        onSearchChange={setSearchQuery}
        onSelectItem={handleSelectItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1, // Chiếm hết không gian còn lại
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 44, // Padding để content không bị che bởi action buttons
  },
  actionContainer: {
    position: 'absolute', // Cố định tuyệt đối
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 50, // Thêm padding bottom cho safe area
    elevation: 8, // Shadow cho Android
    shadowColor: '#000', // Shadow cho iOS
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default CreateExamScreen;
