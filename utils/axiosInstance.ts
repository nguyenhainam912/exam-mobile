import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import data from './data';

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // Kiểm tra nếu không có Authorization header
    if (!config.headers.Authorization) {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (config.params) {
      const { cond, ...otherParams } = config.params;
      if (cond !== undefined && cond !== null) {
        config.params = {
          ...otherParams,
          cond: JSON.stringify(cond),
        };
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) =>
    // Do something with response data
    response,
  async (error) => {
    if (error.response && error.response.data instanceof Blob) {
      const text = await error.response.data.text();
      const errorData = JSON.parse(text);
      error.response.data = errorData;
    }
    switch (error?.response?.status) {
      case 400: {
        Toast.show({
          type: 'error',
          text1: 'Có lỗi xảy ra',
          text2:
            data.error[
              error?.response?.data?.detail?.errorCode ||
                error?.response?.data?.errorCode
            ] ||
            error?.response?.data?.errorDescription ||
            error?.data?.detail?.message ||
            error?.message ||
            error?.response?.data?.errorCode,
        });
        break;
      }

      case 401:
        Toast.show({
          type: 'error',
          text1: 'Vui lòng đăng nhập lại',
        });
        // clear storage
        await AsyncStorage.removeItem('vaiTro');
        await AsyncStorage.removeItem('token');
        // Điều hướng lại login nếu cần
        // navigation.replace('Login');
        break;

      case 404:
        Toast.show({
          type: 'error',
          text1: 'Lỗi không tìm thấy dữ liệu',
          text2:
            error?.response?.data?.detail?.message ||
            error?.message ||
            'Hãy thử refresh lại để cập nhật phiên bản mới.',
        });
        break;

      case 405:
        Toast.show({
          type: 'error',
          text1: 'Truy vấn không được phép',
          text2: error?.response?.data?.detail?.message || error?.message,
        });
        break;

      case 409:
        Toast.show({
          type: 'error',
          text1: 'Dữ liệu đã bị trùng',
          text2: error?.response?.data?.message || error?.message,
        });
        break;

      case 500:
        Toast.show({
          type: 'error',
          text1: 'Server gặp lỗi',
          text2: error?.response?.data?.detail?.message || error?.message,
        });
        break;

      default:
        break;
    }
    return Promise.reject(error);
    // throw error
  },
  // Do something with response error
);

export default axiosInstance;
