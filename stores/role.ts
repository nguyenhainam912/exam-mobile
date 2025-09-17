import { RoleStore } from '@@/services/role';
import { create } from 'zustand';
import { BaseFormStore } from '../utils/interfaces';

const useRoleStore = create<BaseFormStore & RoleStore>((set, get) => ({
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

  record: {} as any,
  setRecord: (record) => set({ record }),
}));

export default useRoleStore;
