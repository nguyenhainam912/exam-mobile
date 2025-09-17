import axiosInstance from '@/utils/axiosInstance';

// upload multidoc
export async function uploadMulti(payload: any) {
  try {
    const form = new FormData();
    const prefix = 'prefix';
    const bool: any = true;
    form.append('public', bool);
    form.append('prefix', prefix);
    payload?.map((item: string | Blob) => form.append('files', item));

    const response = await axiosInstance.post(`/file/document/multiple`, form);
    return response?.data
  } catch (error) {
    throw error
  }
}

// upload multiPic
export async function uploadMultiPic(payload: any) {
  try {
    const form = new FormData();
    const prefix = 'prefix';
    const bool: any = true;
    form.append('public', bool);
    form.append('prefix', prefix);
    payload?.map((item: string | Blob) => form.append('files', item));

    const response = await axiosInstance.post(`/file/image/multiple`, form);
    return response?.data
  } catch (error) {
    throw error
  }
}
