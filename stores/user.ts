import { create } from 'zustand';
// import { BaseFormStore } from '../utils/interfaces';
// import { UserStore } from '@/services/user/typing';

const useUserStore = create<any>((set, get) => ({
  itemList: [],
  setItemList: (itemList: any[]) => set({ itemList }),

  loading: false,
  setLoading: (loading: boolean) => set({ loading }),

  total: 0,
  setTotal: (total: number) => set({ total }),

  page: 1,
  setPage: (page: number) => set({ page }),

  limit: 10,
  setLimit: (limit: number) => set({ limit }),

  cond: {},
  setCondition: (cond: any) => set({ cond }),

  filterInfo: {},
  setFilterInfo: (filterInfo: any) => set({ filterInfo }),

  visibleForm: false,
  setVisibleForm: (visibleForm: boolean) => set({ visibleForm }),

  edit: false,
  setEdit: (edit: boolean) => set({ edit }),

  view: false,
  setView: (view: boolean) => set({ view }),

  isCreate: false,
  setIsCreate: (isCreate: boolean) => set({ isCreate }),

  record: {} as any,
  setRecord: (record: any) => set({ record }),
}));

export default useUserStore;
