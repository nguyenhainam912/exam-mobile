import type { Permission } from '@@/services/permission';
import { create } from 'zustand';
import { BaseFormStore } from '../utils/interfaces';

const usePermissionStore = create<
  BaseFormStore & {
    itemList: Permission.Record[];
    setItemList: (itemList: Permission.Record[]) => void;
    record: Permission.Record;
    setRecord: (record: Permission.Record) => void;
  }
>((set, get) => ({
  itemList: [],
  setItemList: (itemList) => set({ itemList }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  total: 0,
  setTotal: (total) => set({ total }),

  page: 1,
  setPage: (page) => set({ page }),

  limit: 10,
  setLimit: (limit) => set({ limit }),

  cond: {},
  setCondition: (cond) => set({ cond }),

  filterInfo: {},
  setFilterInfo: (filterInfo) => set({ filterInfo }),

  visibleForm: false,
  setVisibleForm: (visibleForm) => set({ visibleForm }),

  edit: false,
  setEdit: (edit) => set({ edit }),

  view: false,
  setView: (view) => set({ view }),

  isCreate: false,
  setIsCreate: (isCreate) => set({ isCreate }),

  record: {} as Permission.Record,
  setRecord: (record) => set({ record }),
}));

export default usePermissionStore;
