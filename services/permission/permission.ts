import axiosInstance from '@/utils/axiosInstance';

export async function getPermissions(payload: { page: number; limit: number; cond?: any }) {
  try {
    const { page, limit, cond } = payload;
    const response = await axiosInstance.get('/rbac/permissions/pageable', {
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

export async function postPermissions(payload: any) {
  return await axiosInstance.post('/rbac/permission', payload);
}

export async function putPermissions(id: string, payload: any) {
  return await axiosInstance.put(`/rbac/permission/${id}`, payload);
}

export async function delPermissions(id: string) {
  return await axiosInstance.delete(`/rbac/permission/${id}`);
}

export async function getPermissionById(id: string) {
  try {
    const response = await axiosInstance.get(`/rbac/permission/${id}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
} 