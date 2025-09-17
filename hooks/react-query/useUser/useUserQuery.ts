import useUserStore from '@/stores/user';
import { GetParams } from '@/utils/interfaces';
import { getListUser, getUserById } from '@@/services/user/user';
import { useQuery } from '@tanstack/react-query';

export const useUserQuery = (params: GetParams) => {
  const { setTotal } = useUserStore();
  return useQuery({
    queryKey: ['user', params],
    queryFn: async () => {
      const response = await getListUser(params);
      setTotal(response?.data?.total ?? 0);
      return response?.data?.result ?? [];
    },
  });
};

export const useUserByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['userById', id],
    queryFn: async () => {
      const response = await getUserById(id);
      return response?.data ?? [];
    },
    enabled: !!id,
  });
};
