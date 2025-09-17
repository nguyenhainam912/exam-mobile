import axiosInstance from '@/utils/axiosInstance';

export async function getNotification(payload: { page: number; limit: number; cond?: any; }) {
  try {
    const { page, limit, cond } = payload;
    const response = await axiosInstance.get(`/notify/notifications`, {
      params: {
        page,
        limit,
        cond,
      },
    });
    return response?.data
  } catch (error) {
    throw error
  }
}

export async function putNotification(id: string, payload: any ) {
  try {
    const response = await axiosInstance.put(`/notification/user-notification/${id}`, payload);
    return response?.data
  } catch (error) {
    throw error
  }
}
export async function putNotifications(payload: any ) {
  try {
    const response = await axiosInstance.put(`/notification/user-notifications`, payload);
    return response?.data
  } catch (error) {
    throw error
  }
}
