import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getDevHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return ip;
    }
  }

  if (Platform.OS === 'android') {
    return '10.67.105.149';
  }

  return '127.0.0.1';
};

// Production Live Render Backend URL
export const PROD_API_URL = 'https://nath-water-backend.onrender.com/api';

// Uses Live Render Backend for production build, or Local IP for dev mode
export const API_BASE_URL = __DEV__ ? `http://${getDevHost()}:5000/api` : PROD_API_URL;

export const APP_NAME = 'Nath Water Service';
export const CURRENCY_SYMBOL = '₹';
