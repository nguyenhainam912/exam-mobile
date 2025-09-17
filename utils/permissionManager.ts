import { ALL_PERMISSIONS } from '@/config/permissions';

export interface Permission {
  method: string;
  apiPath: string;
  module: string;
}

export interface UserPermission {
  method: string;
  apiPath: string;
  module: string;
  _id?: string;
  name?: string;
}

class PermissionManager {
  private userPermissions: UserPermission[] = [];

  setUserPermissions(permissions: UserPermission[]): void {
    this.userPermissions = permissions || [];
  }

  hasPermission(permission: Permission): boolean {
    if (!this.userPermissions || this.userPermissions.length === 0) {
      return false;
    }

    return this.userPermissions.some((userPerm) =>
      userPerm.apiPath === permission.apiPath &&
      userPerm.method === permission.method &&
      userPerm.module === permission.module
    );
  }

  hasModulePermission(module: string, action: string): boolean {
    const permissionKey = ALL_PERMISSIONS[module as keyof typeof ALL_PERMISSIONS];
    if (!permissionKey) return false;

    const permission = permissionKey[action as keyof typeof permissionKey];
    if (!permission) return false;

    return this.hasPermission(permission);
  }

  clearPermissions(): void {
    this.userPermissions = [];
  }
}

export const permissionManager = new PermissionManager(); 