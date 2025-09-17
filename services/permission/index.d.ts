export declare namespace Permission {
  export interface Record {
    _id: string;
    name?: string;
    module?: string;
    method?: string;
    apiPath?: string;
    createdAt?: string;
    updatedAt?: string;
  }
}

export interface PermissionStore {
  itemList: Permission.Record[];
  setItemList: (itemList: Permission.Record[]) => void;
  record: Permission.Record;
  setRecord: (record: Permission.Record) => void;
} 