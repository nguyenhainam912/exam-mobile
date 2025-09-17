import { MutationOptions } from '@/utils/interfaces';
import {
  delPermissions,
  postPermissions,
  putPermissions,
} from '@@/services/permission/permission';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePostPermissionMutation = ({
  onSuccess,
  onError,
  params,
}: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      return await postPermissions(payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['permission', params] });
      onSuccess && onSuccess(data);
    },
    onError: (error) => {
      onError && onError(error);
    },
  });
};

export const usePutPermissionMutation = ({
  onSuccess,
  onError,
  params,
}: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; body: any }) => {
      return await putPermissions(payload.id, payload.body);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['permission', params] });
      onSuccess && onSuccess(data);
    },
    onError: (error) => {
      onError && onError(error);
    },
  });
};

export const useDeletePermissionMutation = ({
  onSuccess,
  onError,
  params,
}: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await delPermissions(id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['permission', params] });
      onSuccess && onSuccess(data);
    },
    onError: (error) => {
      onError && onError(error);
    },
  });
};
