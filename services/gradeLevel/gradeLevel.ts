import axiosInstance from '@/utils/axiosInstance';

export async function getGradeLevels(payload: { page: number; limit: number; cond?: any }) {
  try {
    const { page, limit, cond } = payload;
    const response = await axiosInstance.get('/grade-levels', {
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

export async function postGradeLevel(payload: any) {
  return await axiosInstance.post('/grade-levels', payload);
}

export async function putGradeLevel(id: string, payload: any) {
  return await axiosInstance.put(`/grade-levels/${id}`, payload);
}

export async function delGradeLevel(id: string) {
  return await axiosInstance.delete(`/grade-levels/${id}`);
}

export async function getGradeLevelById(id: string) {
  try {
    const response = await axiosInstance.get(`/grade-levels/${id}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
} 