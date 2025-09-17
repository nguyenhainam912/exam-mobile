export declare namespace Exam {
  export interface Record {
    _id?: string;
    title: string;
    description?: string;
    subjectId: { _id: string; name?: string };
    gradeLevelId: { _id: string; name?: string };
    examTypeId: { _id: string; name?: string };
    questions: any[];
    duration: number;
    status: string;
    createdAt?: string;
    updatedAt?: string;
  }
}

export interface ExamStore {
  itemList: Exam.Record[];
  setItemList: (itemList: Exam.Record[]) => void;
  record: Exam.Record;
  setRecord: (record: Exam.Record) => void;
} 