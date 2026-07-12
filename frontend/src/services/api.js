import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || '/api';

if (baseURL.startsWith('http')) {
  // Remove any trailing slashes first
  baseURL = baseURL.replace(/\/+$/, '');
  // Append /api if it is not already present at the end
  if (!baseURL.endsWith('/api')) {
    baseURL += '/api';
  }
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token into all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
