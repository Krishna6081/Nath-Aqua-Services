import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

console.log('🌐 Nath Water Service API Base URL:', API_BASE_URL);

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => {
    console.log(`[API SUCCESS] ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Retry with fallback hotspot IP 10.67.105.149 if primary IP request failed
    if (error.message.includes('Network Error') && !originalRequest._retry) {
      originalRequest._retry = true;
      const fallbackUrl = 'http://10.67.105.149:5000/api';
      console.log(`⚠️ Network Error on ${originalRequest.baseURL}. Retrying request with fallback IP: ${fallbackUrl}`);
      originalRequest.baseURL = fallbackUrl;
      return axios(originalRequest);
    }

    console.error(`[API ERROR] ${error.config?.url} - ${error.message}`);
    const message =
      error.response?.data?.message ||
      `Network error: Cannot connect to server. Check that Windows Firewall allows port 5000 and mobile phone is on Hotspot.`;
    return Promise.reject(new Error(message));
  }
);

export default client;
