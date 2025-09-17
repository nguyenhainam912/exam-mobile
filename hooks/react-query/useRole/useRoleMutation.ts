import { MutationOptions } from '@/utils/interfaces';
import { delRole, postRole, putRole } from '@@/services/role/role';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePostRoleMutation = <T>({
  onSuccess,
  onError,
  params,
}: MutationOptions<T>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      return await postRole(payload);
    },
    onSuccess: (data: T) => {
      queryClient.invalidateQueries({ queryKey: ['roles', params] });
      onSuccess && onSuccess(data);
    },
    onError: (error) => {
      onError && onError(error);
    },
  });
};

export const usePutRoleMutation = <T>({
  onSuccess,
  onError,
  params,
}: MutationOptions<T>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; body: any }) => {
      return await putRole(payload.id, payload.body);
    },
    onSuccess: (data: T) => {
      queryClient.invalidateQueries({ queryKey: ['roles', params] });
      onSuccess && onSuccess(data);
    },
    onError: (error) => {
      onError && onError(error);
    },
  });
};

export const useDeleteRoleMutation = <T>({
  onSuccess,
  onError,
  params,
}: MutationOptions<T>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await delRole(id);
    },
    onSuccess: (data: T) => {
      queryClient.invalidateQueries({ queryKey: ['roles', params] });
      onSuccess && onSuccess(data);
    },
    onError: (error) => {
      onError && onError(error);
    },
  });
};
