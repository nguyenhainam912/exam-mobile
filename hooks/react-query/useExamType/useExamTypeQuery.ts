import useExamTypeStore from '@/stores/examType';
import { GetParams } from '@/utils/interfaces';
import { getExamTypeById, getExamTypes } from '@@/services/examType/examType';
import { useQuery } from '@tanstack/react-query';

export const useExamTypeQuery = (params: GetParams) => {
  const { setTotal } = useExamTypeStore();
  return useQuery({
    queryKey: ['exam-type', params],
    queryFn: async () => {
      const response = await getExamTypes(params);
      setTotal(response?.data?.total ?? 0);
      return response?.data?.result ?? [];
    },
  });
};

export const useExamTypeByIdQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['exam-type', 'detail', id],
    queryFn: async () => {
      const response = await getExamTypeById(id!);
      return response?.data;
    },
    enabled: !!id,
  });
};
