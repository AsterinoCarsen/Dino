import { useRouter } from 'next/router';
import api from '../api';
import useAuthStore from '../store/authStore';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    userId: string;
    username: string;
    createdAt: string;
  };
}

export function useAuth() {
  const { setAuth, clearAuth, token, user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const login = async (dto: LoginRequest) => {
    const response = await api.post<AuthResponse>('/api/auth/login', dto);
    setAuth(response.token, response.user);
    router.push('/dashboard');
  };

  const register = async (dto: RegisterRequest) => {
    const response = await api.post<AuthResponse>('/api/auth/register', dto);
    setAuth(response.token, response.user);
    router.push('/dashboard');
  };

  const logout = () => {
    clearAuth();
    router.push('/');
  };

  return { login, register, logout, token, user, isAuthenticated };
}