import type { ColumnType as ICol } from 'rc-table/lib/interface';

export interface IColumn<T> extends ICol<T> {
  search?: 'search' | 'filter' | 'sort' | 'filterTF' | 'filterString';
  columnKey?: string;
  notRegex?: boolean;
  children?: any;
}

export interface BaseFormStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  total: number;
  setTotal: (total: number) => void;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  cond: any;
  setCondition: (cond: any) => void;
  filterInfo: {};
  setFilterInfo: (filterInfo: any) => void;
  visibleForm: boolean;
  setVisibleForm: (visible: boolean) => void;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  view: boolean;
  setView: (view: boolean) => void;
  isCreate: boolean;
  setIsCreate: (isCreate: boolean) => void;
}

export type GetParams = { 
  page: number; 
  limit: number; 
  cond?: any;  
  type?: any;
  enabled?: boolean;
}

export interface MutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  params?: any
}