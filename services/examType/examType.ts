import axiosInstance from '@/utils/axiosInstance';

export async function getExamTypes(payload: { page: number; limit: number; cond?: any }) {
  try {
    const { page, limit, cond } = payload;
    const response = await axiosInstance.get('/exam-types', {
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

export async function postExamType(payload: any) {
  return await axiosInstance.post('/exam-types', payload);
}

export async function putExamType(id: string, payload: any) {
  return await axiosInstance.put(`/exam-types/${id}`, payload);
}

export async function delExamType(id: string) {
  return await axiosInstance.delete(`/exam-types/${id}`);
}

export async function getExamTypeById(id: string) {
  try {
    const response = await axiosInstance.get(`/exam-types/${id}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
} 