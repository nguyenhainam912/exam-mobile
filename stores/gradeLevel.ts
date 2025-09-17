import { create } from 'zustand';
import { BaseFormStore } from '../utils/interfaces';

export interface GradeLevelRecord {
  _id?: string;
  name: string;
  code: string;
  description?: string;
}

const useGradeLevelStore = create<BaseFormStore & {
  itemList: GradeLevelRecord[];
  setItemList: (itemList: GradeLevelRecord[]) => void;
  record: GradeLevelRecord;
  setRecord: (record: GradeLevelRecord) => void;
}>(
  (set, get) => ({
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
    record: {} as GradeLevelRecord,
    setRecord: (record) => set({ record }),
  })
);

export default useGradeLevelStore; 