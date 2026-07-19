import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Capacitor } from '@capacitor/core';
import { Http } from '@capacitor-community/http';
import { environment } from '../../environments/environment';

const api: AxiosInstance = axios.create({
  baseURL: environment.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const PUBLIC_ENDPOINTS = new Set(['/login', '/register', '/logout', '/recoverPass', '/reset-password']);

function isPublicEndpoint(url?: string): boolean {
  if (!url) return false;
  // url may be a full URL or a path. Strip baseURL if present.
  const path = url.replace(environment.apiUrl, '').split('?')[0];
  return PUBLIC_ENDPOINTS.has(path);
}

function toAbsoluteUrl(endpoint: string): string {
  return new URL(endpoint, environment.apiUrl).toString();
}

function normalizeParams(params?: AxiosRequestConfig['params']): Record<string, string | string[]> | undefined {
  if (!params) return undefined;

  const normalized: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      normalized[key] = value.map((item) => String(item));
    } else if (value !== undefined && value !== null) {
      normalized[key] = String(value);
    }
  }

  return Object.keys(normalized).length ? normalized : undefined;
}

function normalizeHeaders(headers?: AxiosRequestConfig['headers'], data?: unknown): Record<string, string> | undefined {
  const normalized = AxiosHeaders.from(headers as any).toJSON() as Record<string, string>;

  if (data instanceof FormData) {
    delete normalized['Content-Type'];
    delete normalized['content-type'];
  }

  return Object.keys(normalized).length ? normalized : undefined;
}

function createAxiosLikeError<T>(status: number, url: string, data: T, config: AxiosRequestConfig): AxiosError {
  const response = {
    data,
    status,
    statusText: '',
    headers: {},
    config,
    request: undefined,
  } as AxiosResponse<T>;

  const error = new AxiosError(`Request failed with status code ${status}`) as AxiosError;
  error.config = config as any;
  error.response = response;
  error.status = status;
  error.toJSON = error.toJSON.bind(error);
  return error;
}

async function nativeRequest<T>(method: string, endpoint: string, data?: unknown, config: AxiosRequestConfig = {}): Promise<T> {
  const url = toAbsoluteUrl(endpoint);
  console.log('[api request]', { method, url: endpoint, data, params: config.params, headers: config.headers });
  const response = await Http.request({
    url,
    method,
    data,
    params: normalizeParams(config.params),
    headers: normalizeHeaders(config.headers, data),
  });

  console.log('[api response]', { method, url: endpoint, status: response.status, data: response.data });

  if (response.status >= 400) {
    const error = createAxiosLikeError<T>(response.status, url, response.data as T, {
      ...config,
      url: endpoint,
      method,
    });
    console.error('[api error]', { method, url: endpoint, status: response.status, data: response.data, error });

    if ((response.status === 401 || response.status === 400) && !isPublicEndpoint(endpoint)) {
      const hashPath = typeof window !== 'undefined' ? (window.location.hash || '#/').replace(/^#/, '') : '';
      if (typeof window !== 'undefined' && !hashPath.startsWith('/login')) {
        try {
          localStorage.removeItem('ngdesu_user');
          localStorage.removeItem('ngdesu_user_image');
        } catch {
          // ignore localStorage failures
        }
        window.location.hash = '#/login';
      }
    }

    throw error;
  }

  return response.data as T;
}

api.interceptors.request.use(
  (config) => {
    console.log('[api request]', { method: config.method?.toUpperCase(), url: config.url, data: config.data, params: config.params });
    // For FormData payloads, let the browser/RN set Content-Type (with the multipart boundary).
    // Using `?.` to be safe against AxiosHeaders sometimes being undefined.
    if (config.data instanceof FormData) {
      const h = config.headers as Record<string, unknown> | undefined;
      if (h) delete h['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    console.log('[api response]', { method: response.config.method?.toUpperCase(), url: response.config.url, status: response.status, data: response.data });
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;
    console.error('[api error]', {
      method: error.config?.method?.toUpperCase(),
      url,
      status,
      data: error.response?.data,
      message: error.message,
      error,
    });

    // If the user is not authenticated on a protected endpoint, clear the local
    // auth cache and bounce them to /login. Skip this for public endpoints
    // (login/register/logout/etc.) so a failed login doesn't redirect.
    if ((status === 401 || status === 400) && !isPublicEndpoint(url)) {
      // Only redirect once per error to avoid loops.
      const hashPath = typeof window !== 'undefined' ? (window.location.hash || '#/').replace(/^#/, '') : '';
      if (typeof window !== 'undefined' && !hashPath.startsWith('/login')) {
        try {
          localStorage.removeItem('ngdesu_user');
          localStorage.removeItem('ngdesu_user_image');
        } catch {
          // ignore localStorage failures
        }
        window.location.hash = '#/login';
      }
    }

    return Promise.reject(error);
  },
);

export default {
  get: async <T = unknown>(endpoint: string, config: AxiosRequestConfig = {}) =>
    Capacitor.isNativePlatform()
      ? nativeRequest<T>('GET', endpoint, undefined, config)
      : api.get<T, AxiosResponse<T>>(endpoint, config).then((r) => r.data),

  post: async <T = unknown>(endpoint: string, data?: unknown, config: AxiosRequestConfig = {}) =>
    Capacitor.isNativePlatform()
      ? nativeRequest<T>('POST', endpoint, data, config)
      : api.post<T, AxiosResponse<T>>(endpoint, data, config).then((r) => r.data),

  put: async <T = unknown>(endpoint: string, data?: unknown, config: AxiosRequestConfig = {}) =>
    Capacitor.isNativePlatform()
      ? nativeRequest<T>('PUT', endpoint, data, config)
      : api.put<T, AxiosResponse<T>>(endpoint, data, config).then((r) => r.data),

  delete: async <T = unknown>(endpoint: string, config: AxiosRequestConfig = {}) =>
    Capacitor.isNativePlatform()
      ? nativeRequest<T>('DELETE', endpoint, undefined, config)
      : api.delete<T, AxiosResponse<T>>(endpoint, config).then((r) => r.data),
};
