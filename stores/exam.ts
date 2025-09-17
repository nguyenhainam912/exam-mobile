import type { Exam } from '@@/services/exam';
import { create } from 'zustand';
import { BaseFormStore } from '../utils/interfaces';

const useExamStore = create<
  BaseFormStore & {
    itemList: Exam.Record[];
    setItemList: (itemList: Exam.Record[]) => void;
    record: Exam.Record;
    setRecord: (record: Exam.Record) => void;
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
  record: {} as Exam.Record,
  setRecord: (record) => set({ record }),
}));

export default useExamStore;
