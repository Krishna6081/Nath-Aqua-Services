import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from '../../redux/slices/authSlice';
import { initSQLiteDatabase } from '../../database/sqlite';
import { AppDispatch } from '../../redux/store';

export const SplashScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initializeApp = async () => {
      await initSQLiteDatabase();
      const result = await dispatch(checkAuthStatus()).unwrap();

      setTimeout(() => {
        if (result && result.user) {
          if (result.user.role === 'ADMIN') {
            navigation.replace('AdminApp');
          } else if (result.user.role === 'DELIVERY_PERSON') {
            navigation.replace('DeliveryApp');
          } else {
            navigation.replace('CustomerApp');
          }
        } else {
          navigation.replace('Onboarding');
        }
      }, 1500);
    };

    initializeApp();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>💧</Text>
      <Text variant="headlineMedium" style={styles.title}>
        Nath Water Service
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Pure Water Delivered to Your Door
      </Text>
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#e0f2fe',
    marginTop: 8,
  },
  loader: {
    marginTop: 32,
  },
});
