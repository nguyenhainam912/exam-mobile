import axiosInstance from "@/utils/axiosInstance";


export const uploadPdf = async (payload: any) => {
    try {
      const form = new FormData();
      const prefix = 'prefix';
      const bool: any = true;
      form.append('public', bool);
      form.append('prefix', prefix);
      payload?.map((item: string | Blob) => form.append('files', item));

      const response = await axiosInstance.post(`/invoice/upload-pdf`, form);
      return response?.data
    } catch (error) {
      throw error
    }
};
