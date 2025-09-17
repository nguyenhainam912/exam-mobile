import axiosInstance from '@/utils/axiosInstance';

export async function getSubjects(payload: { page: number; limit: number; cond?: any }) {
  try {
    const { page, limit, cond } = payload;
    const response = await axiosInstance.get('/subjects', {
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

export async function postSubject(payload: any) {
  return await axiosInstance.post('/subjects', payload);
}

export async function putSubject(id: string, payload: any) {
  return await axiosInstance.put(`/subjects/${id}`, payload);
}

export async function delSubject(id: string) {
  return await axiosInstance.delete(`/subjects/${id}`);
}

export async function getSubjectById(id: string) {
  try {
    const response = await axiosInstance.get(`/subjects/${id}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
} 