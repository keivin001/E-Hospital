import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function clearAuthToken() {
  delete api.defaults.headers.common.Authorization;
}

export function backendEnabled() {
  // Only enable if VITE_API_URL is explicitly set in .env
  return !!(import.meta.env.VITE_API_URL);
}

export default api;
