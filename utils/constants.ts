import { ALL_PERMISSIONS } from '@/config/permissions';

export enum Pathname {
  SYSTEM_ROLE_MANAGEMENT = 'system/role-management',
  SYSTEM_PERMISSION_MANAGEMENT = 'system/permission-management', // Quản lý permission
  SYSTEM_GRADE_LEVELS_MANAGEMENT = 'system/grade-levels-management', // Quản lý khối lớp
  SYSTEM_EXAM_TYPES_MANAGEMENT = 'system/exam-types-management',
  SYSTEM_SUBJECTS_MANAGEMENT = 'system/subjects-management', // Quản lý môn học
  SYSTEM_EXAMS_MANAGEMENT = 'system/exams-management', // Quản lý đề thi
  SYSTEM_USER_MANAGEMENT = 'system/user-management', // Quản lý người dùng
  SYSTEM_EXAM_CHANGE_REQUEST_MANAGEMENT = 'system/exam-change-request-management', // Quản lý yêu cầu thay đổi đề thi
}

export const METHOD_OPTIONS = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' },
];

// Lấy các module unique từ ALL_PERMISSIONS
const extractModules = () => {
  const modules = new Set<string>();
  
  Object.values(ALL_PERMISSIONS).forEach(category => {
    Object.values(category).forEach(permission => {
      if (permission.module) {
        modules.add(permission.module);
      }
    });
  });
  
  return Array.from(modules).map(module => ({
    label: module,
    value: module
  }));
};

// Lấy các apiPath unique từ ALL_PERMISSIONS
const extractApiPaths = () => {
  const apiPaths = new Set<string>();
  
  Object.values(ALL_PERMISSIONS).forEach(category => {
    Object.values(category).forEach(permission => {
      if (permission.apiPath) {
        apiPaths.add(permission.apiPath);
      }
    });
  });
  
  return Array.from(apiPaths).map(apiPath => ({
    label: apiPath,
    value: apiPath
  }));
};

export const MODULE_OPTIONS = extractModules();
export const API_PATH_OPTIONS = extractApiPaths();


