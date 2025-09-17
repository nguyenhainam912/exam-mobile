export declare module User {
  export interface Profile {
    _id: string;
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  }
}

export interface UserStore {
  itemList: User.Profile[];
  setItemList: (itemList: User.Profile[]) => void
  record: User.Profile
  setRecord: (record: User.Profile) => void
}
