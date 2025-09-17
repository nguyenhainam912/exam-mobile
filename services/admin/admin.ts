import axiosInstance from '@@/utils/axiosInstance';

export async function getInfoAdmin(options?: any) {
  try {
    const response = await axiosInstance.get(`/user/me`);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function login(payload: any, options?: any) {
  try {
    const response = await axiosInstance.post(`/auth/login`, payload);
    return response?.data;
  } catch (error) {
    throw error;
  }
}
