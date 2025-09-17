import { MutationOptions } from '@/utils/interfaces';
import {
  delExamType,
  postExamType,
  putExamType,
} from '@@/services/examType/examType';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePostExamTypeMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postExamType,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam-type'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const usePutExamTypeMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      putExamType(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam-type'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const useDeleteExamTypeMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delExamType,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam-type'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};
