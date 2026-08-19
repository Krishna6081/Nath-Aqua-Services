import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { store, RootState } from './src/redux/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { lightTheme, darkTheme } from './src/constants/theme';
import { StatusBar } from 'expo-status-bar';

const MainApp = () => {
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <RootNavigator />
    </PaperProvider>
  );
};

export default function App() {
  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <MainApp />
      </SafeAreaProvider>
    </ReduxProvider>
  );
}
