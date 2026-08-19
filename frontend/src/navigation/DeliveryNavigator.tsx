import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DeliveryDashboardScreen } from '../screens/delivery/DeliveryDashboardScreen';
import { DeliveryDetailScreen } from '../screens/delivery/DeliveryDetailScreen';

const Stack = createNativeStackNavigator();

export const DeliveryNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DeliveryDashboard" component={DeliveryDashboardScreen} />
      <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
    </Stack.Navigator>
  );
};
