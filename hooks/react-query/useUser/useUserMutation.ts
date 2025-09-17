import { MutationOptions } from '@/utils/interfaces';
import { deleteUser, postUser, putUser } from '@@/services/user/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePostUserMutation = <T>({
  onSuccess,
  onError,
  params,
}: MutationOptions<T>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      return await postUser(payload);
    },
    onSuccess: (data: T) => {
      queryClient.invalidateQueries({ queryKey: ['user', params] });
      onSuccess && onSuccess(data);
    },
    onError: (error) => {
      onError && onError(error);
    },
  });
};

export const usePutUserMutation = <T>({
  onSuccess,
  onError,
  params,
}: MutationOptions<T>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; body: any }) => {
      return await putUser(payload.id, payload.body);
    },
    onSuccess: (data: T) => {
      queryClient.invalidateQueries({ queryKey: ['user', params] });
      onSuccess && onSuccess(data);
    },
    onError: (error) => {
      onError && onError(error);
    },
  });
};

export const useDeleteUserMutation = <T>({
  onSuccess,
  onError,
  params,
}: MutationOptions<T>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteUser(id);
    },
    onSuccess: (data: T) => {
      queryClient.invalidateQueries({ queryKey: ['user', params] });
      onSuccess && onSuccess(data);
    },
    onError: (error) => {
      onError && onError(error);
    },
  });
};
