import axiosInstance  from '@/utils/axiosInstance';

/** Lấy danh sách người dùng có phân trang */
export async function getListUser(payload: { page: number; limit: number; cond?: any }) {
  try {
    const { page, limit, cond } = payload;
    const response = await axiosInstance.get('/user', {
      params: {
        page,
        limit,
        ...((Object.keys(cond)?.length > 0 && cond) && {cond: {
          ...cond,
        }})
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
}

/** Lấy thông tin người dùng theo ID */
export async function getUserById(id: string) {
  try {
    const response = await axiosInstance.get(`/user/${id}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

/*Update user */
export async function putUser(id: string, payload: any) {
  try {
    const response = await axiosInstance.put(`/user/${id}`, payload);
    return response?.data
  } catch (error) {
    throw error
  }
}

/* Tạo mới người dùng */
export async function postUser(payload: any) {
  try {
    const response = await axiosInstance.post(`/user`, payload);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

/* REGISTER USER */
export async function register(payload: any) {
  try {
    const response = await axiosInstance.post(`/auth/register`, payload);
    return response?.data
  } catch (error) {
    throw error
  }
}

/* VERIFY EMAIL */
export async function verifyEmail(payload: { token: string }) {
  try {
    const response = await axiosInstance.post(`/auth/verify-email`, payload);
    return response?.data
  } catch (error) {
    throw error
  }
}

/* RESEND VERIFICATION EMAIL */
export async function resendVerificationEmail(payload: { email: string }) {
  try {
    const response = await axiosInstance.post(`/auth/resend-verification`, payload);
    return response?.data
  } catch (error) {
    throw error
  }
}

/* SEND VERIFY EMAIL */
export async function sendVerifyEmail(payload: { email: string; verifyUrl: string }) {
  try {
    const response = await axiosInstance.post(`/auth/send-verify-email`, payload);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

/** Xóa người dùng theo ID */
export async function deleteUser(id: string) {
  try {
    const response = await axiosInstance.delete(`/user/${id}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
}
