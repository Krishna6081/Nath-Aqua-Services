import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getDevHost = () => {
  // 1. Try to extract host IP from Expo Go
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

  // 2. Mobile Hotspot IPv4 address on Wi-Fi adapter
  if (Platform.OS !== 'web') {
    return '10.67.105.149';
  }

  return '127.0.0.1';
};

export const API_BASE_URL = `http://${getDevHost()}:5000/api`;
export const APP_NAME = 'Nath Water Service';
export const CURRENCY_SYMBOL = '₹';
