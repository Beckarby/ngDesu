import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { environment } from '../../environments/environment';

const api: AxiosInstance = axios.create({
  baseURL: environment.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers!['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default {
  get: <T = unknown>(endpoint: string, config: AxiosRequestConfig = {}) =>
    api.get<T, AxiosResponse<T>>(endpoint, config).then((r) => r.data),
  
  post: <T = unknown>(endpoint: string, data?: unknown, config: AxiosRequestConfig = {}) =>
    api.post<T, AxiosResponse<T>>(endpoint, data, config).then((r) => r.data),
  
  put: <T = unknown>(endpoint: string, data?: unknown, config: AxiosRequestConfig = {}) =>
    api.put<T, AxiosResponse<T>>(endpoint, data, config).then((r) => r.data),
  
  delete: <T = unknown>(endpoint: string, config: AxiosRequestConfig = {}) =>
    api.delete<T, AxiosResponse<T>>(endpoint, config).then((r) => r.data),
};
