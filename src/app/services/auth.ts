import api from './api';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  image: string;
}

/** Shape returned by the backend's `Session.login` data field. */
export interface LoginBackendData {
  users_name: string;
  users_email: string;
}

export interface LoginBackendResponse {
  status: 'success' | 'error';
  data?: LoginBackendData;
  user?: LoginBackendData;
  message?: string;
}

export interface RegisterBackendResponse {
  status: 'success' | 'error';
  message?: string;
}

export interface LoginResponse {
  user?: AuthUser;
  message?: string;
  raw?: LoginBackendResponse;
}

export interface RegisterResponse {
  status?: 'success' | 'error';
  message?: string;
}

// 0 = username (image is localStorage-only, email is not user-editable)
export type UserUpdateOption = 0;

const USER_KEY = 'ngdesu_user';
const IMAGE_KEY = 'ngdesu_user_image';

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const data = await api.post<LoginBackendResponse>('/login', { user: username, pass: password });
    const res: LoginResponse = { raw: data };
    const backendUser = data.data ?? data.user;
    if (data.status === 'success') {
      const user: AuthUser = {
        id: 0, // backend doesn't return id; we don't need it for now
        username: backendUser?.users_name ?? username,
        email: backendUser?.users_email ?? username,
        image: '',
      };
      res.user = user;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    if (data.message) res.message = data.message;
    return res;
  },

  async logout(): Promise<{ message?: string }> {
    const data = await api.post<{ status?: string; message?: string }>('/logout');
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(IMAGE_KEY);
    return { message: data.message };
  },

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<RegisterResponse> {
    return api.post<RegisterBackendResponse>('/register', { username, email, password });
  },

  async updateUser(
    option: UserUpdateOption,
    value: string,
  ): Promise<{ message?: string }> {
    return api.post<{ message?: string }>('/update-user', { option, value });
  },

  getCachedUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },

  getCachedImage(): string | null {
    return localStorage.getItem(IMAGE_KEY);
  },
};
