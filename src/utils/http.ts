// src/utils/http.ts
import axios from 'axios';
import { getAuthToken } from './auth';


const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to outgoing requests
http.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiry and other response issues
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // You could dispatch a logout action here or redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default http;