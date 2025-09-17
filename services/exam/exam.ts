import axiosInstance from '@/utils/axiosInstance';

export async function getExams(payload: { page: number; limit: number; cond?: any }) {
  try {
    const { page, limit, cond } = payload;
    const response = await axiosInstance.get('/exams', {
      params: {
        page,
        limit,
        ...(cond && Object.keys(cond).length > 0 && { cond }),
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function postExam(payload: any) {
  return await axiosInstance.post('/exams', payload);
}

export async function putExam(id: string, payload: any) {
  return await axiosInstance.put(`/exams/${id}`, payload);
}

export async function delExam(id: string) {
  return await axiosInstance.delete(`/exams/${id}`);
}

export async function getExamById(id: string) {
  try {
    const response = await axiosInstance.get(`/exams/${id}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

// Lấy danh sách yêu cầu thay đổi đề thi
export async function getExamChangeRequests(payload: { page: number; limit: number; cond?: any }) {
  try {
    const { page, limit, cond } = payload;
    const response = await axiosInstance.get('/exam-change-requests/pageable', {
      params: {
        page,
        limit,
        ...(cond && Object.keys(cond).length > 0 && { cond }),
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
}

// Lấy chi tiết yêu cầu thay đổi đề thi
export async function getExamChangeRequestDetail(id: string) {
  return await axiosInstance.get(`/exam-change-requests/${id}`);
}

// Duyệt hoặc từ chối yêu cầu thay đổi đề thi
export async function reviewExamChangeRequest(id: string, payload: { status: 'APPROVED' | 'REJECTED' }) {
  return await axiosInstance.put(`/exam-change-requests/${id}/review`, payload);
} 