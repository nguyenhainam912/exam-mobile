export declare module Notification {
  export interface NotiRecord {
    id: string;
    _id: string;
    notiId: string;
    content: string;
    title?: string;
    type: string;
    sentAt?: date;
    info: {
      type: string;
      contractId: string;
    }
    ,
    status: boolean | Number
  }
}
