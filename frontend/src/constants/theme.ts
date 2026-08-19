import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

export const lightPalette = {
  primary: '#0284c7', // Deep Water Blue
  primaryContainer: '#e0f2fe',
  secondary: '#06b6d4', // Cyan Water Accent
  secondaryContainer: '#cffaff',
  tertiary: '#0369a1',
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceVariant: '#f1f5f9',
  error: '#ef4444',
  onPrimary: '#ffffff',
  onSecondary: '#ffffff',
  onBackground: '#0f172a',
  onSurface: '#1e293b',
  outline: '#cbd5e1',
  success: '#10b981',
  warning: '#f59e0b',
  waterGradient: ['#0284c7', '#06b6d4'],
};

export const darkPalette = {
  primary: '#38bdf8',
  primaryContainer: '#075985',
  secondary: '#22d3ee',
  secondaryContainer: '#164e63',
  tertiary: '#7dd3fc',
  background: '#0f172a',
  surface: '#1e293b',
  surfaceVariant: '#334155',
  error: '#f87171',
  onPrimary: '#000000',
  onSecondary: '#000000',
  onBackground: '#f8fafc',
  onSurface: '#f1f5f9',
  outline: '#475569',
  success: '#34d399',
  warning: '#fbbf24',
  waterGradient: ['#0f172a', '#0369a1'],
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightPalette,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkPalette,
  },
};
