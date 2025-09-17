import { StoreApi, UseBoundStore } from 'zustand';
import { useAppStore } from './appStore';
import useExamStore from './exam';
import useExamChangeRequestStore from './examChangeRequest';
import useExamTypeStore from './examType';
import useGradeLevelStore from './gradeLevel';
import usePermissionStore from './permission';
import useRoleStore from './role';
import useSubjectStore from './subject';
import useUserStore from './user';

const storeMap: Record<string, UseBoundStore<StoreApi<any>>> = {
  user: useUserStore,
  role: useRoleStore,
  gradeLevel: useGradeLevelStore,
  examType: useExamTypeStore,
  subject: useSubjectStore,
  exam: useExamStore,
  'exam-change-request': useExamChangeRequestStore,

  app: useAppStore,
  permission: usePermissionStore,
};

export const getStore = (storeName: string | undefined) => {
  return storeName ? storeMap[storeName] : () => ({});
};
