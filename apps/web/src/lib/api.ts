import Router from 'next/router';
import useAuthStore from './store/authStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5028';

function getToken(): string | null {
  return useAuthStore.getState().token;
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    useAuthStore.getState().clearAuth();
    Router.push('/authenticate');
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `HTTP error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

const api = {
  get: <T>(url: string): Promise<T> =>
    fetch(`${BASE_URL}${url}`, {
      headers: authHeaders(),
    }).then(res => handleResponse<T>(res)),

  post: <T>(url: string, body?: unknown): Promise<T> =>
    fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(res => handleResponse<T>(res)),

  delete: <T>(url: string): Promise<T> =>
    fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(res => handleResponse<T>(res)),
};

export default api;