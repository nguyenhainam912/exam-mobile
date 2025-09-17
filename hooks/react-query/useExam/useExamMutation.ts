import { MutationOptions } from '@/utils/interfaces';
import {
  delExam,
  postExam,
  putExam,
  reviewExamChangeRequest,
} from '@@/services/exam/exam';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePostExamMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postExam,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const usePutExamMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => putExam(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const useDeleteExamMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delExam,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const useReviewExamChangeRequestMutation = (
  options: MutationOptions<any>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      reviewExamChangeRequest(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam-change-request'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};
