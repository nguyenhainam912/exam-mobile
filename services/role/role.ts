import axiosInstance from '@/utils/axiosInstance';

export async function getRoles(payload: { page: number; limit: number; cond?: any; }) {
  try {
    const { page, limit, cond } = payload;
    const response = await axiosInstance.get(`/rbac/roles/pageable`, {
      params: {
        page,
        limit,
        ...((Object.keys(cond)?.length > 0 && cond) && {cond: {
          ...cond,
        }})
      },
    });
    return response?.data
  } catch (error) {
    throw error
  }
}

export async function postRole(payload: any) {
  try {
    const response = await axiosInstance.post(`/rbac/role`, payload);
    return response?.data
  } catch (error) {
    throw error
  }
}

export async function putRole(id: string, payload: any) {
  try {
    const response = await axiosInstance.put(`/rbac/role/${id}`, payload);
    return response?.data
  } catch (error) {
    throw error
  }
}
export async function delRole(id: string) {
  try {
    const response = await axiosInstance.delete(`/rbac/role/${id}`);
    return response?.data
  } catch (error) {
    throw error
  }
}

export async function getRoleById(id: string) {
  try {
    const response = await axiosInstance.get(`/rbac/role/${id}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function assignRoleToUser(payload: { userId: string; roleId: string }) {
  try {
    const response = await axiosInstance.post(`/rbac/assign-role`, payload);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

