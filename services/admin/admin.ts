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

export async function googleLogin(payload: { idToken: string }, options?: any) {
  try {
    // Call your backend API for Google authentication
    const response = await axiosInstance.post(`/auth/google/mobile`, payload);
    return response?.data;
  } catch (error) {
    throw error;
  }
}
