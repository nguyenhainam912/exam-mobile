import { MutationOptions } from '@/utils/interfaces';
import {
  delSubject,
  postSubject,
  putSubject,
} from '@@/services/subject/subject';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePostSubjectMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSubject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subject'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const usePutSubjectMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      putSubject(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subject'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const useDeleteSubjectMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delSubject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subject'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};
