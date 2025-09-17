import { MutationOptions } from '@/utils/interfaces';
import {
  delGradeLevel,
  postGradeLevel,
  putGradeLevel,
} from '@@/services/gradeLevel/gradeLevel';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePostGradeLevelMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postGradeLevel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['grade-level'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const usePutGradeLevelMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      putGradeLevel(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['grade-level'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const useDeleteGradeLevelMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delGradeLevel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['grade-level'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};
