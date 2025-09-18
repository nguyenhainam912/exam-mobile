import { getRoleById, getRoles } from '@@/services/role/role';
import useRoleStore from '@@/stores/role';
import { GetParams } from '@@/utils/interfaces';
import { useQuery } from '@tanstack/react-query';

export const useRoleQuery = (params: GetParams) => {
  const { setTotal, setItemList } = useRoleStore();
  console.log('params', params);
  return useQuery({
    queryKey: ['roles', params],
    queryFn: async () => {
      const response = await getRoles(params);
      setTotal(response?.data?.total ?? 0);
      setItemList(response?.data?.item ?? []);
      return response?.data?.result ?? [];
    },
  });
};

export const useRoleByIdQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['role', 'detail', id],
    queryFn: async () => {
      const response = await getRoleById(id!);
      return response?.data;
    },
    enabled: !!id,
  });
};
