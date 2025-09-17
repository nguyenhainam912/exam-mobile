import { useCallback, useMemo } from 'react';
import { useAppStore } from './../stores/appStore';
import { Permission, permissionManager } from './../utils/permissionManager';

export const usePermission = () => {
  const { currentUser } = useAppStore();

  // Sync user permissions with permission manager
  useMemo(() => {
    const permissions = currentUser?.permissions || [];
    permissionManager.setUserPermissions(permissions);
  }, [currentUser?.permissions]);

  // Check specific permission
  const hasPermission = useCallback((permission: Permission): boolean => {
    return permissionManager.hasPermission(permission);
  }, []);

  // Check module permission
  const hasModulePermission = useCallback(
    (module: string, action: string): boolean => {
      return permissionManager.hasModulePermission(module, action);
    },
    [],
  );

  return {
    hasPermission,
    hasModulePermission,
  };
};
