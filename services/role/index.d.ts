export declare namespace Role {
  export interface Record {
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
    permissions: string[];
  }
}

export interface RoleStore {
  itemList: Role.Record[];
  setItemList: (itemList: any[]) => void;
  record: Role.Record;
  setRecord: (record: any) => void;
}