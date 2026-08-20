import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { DeliveryDashboardScreen } from '../screens/delivery/DeliveryDashboardScreen';
import { DeliveryDetailScreen } from '../screens/delivery/DeliveryDetailScreen';
import { DeliveryProfileScreen } from '../screens/delivery/DeliveryProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DeliveryTabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
      }}
    >
      <Tab.Screen
        name="DeliveriesTab"
        component={DeliveryDashboardScreen}
        options={{
          tabBarLabel: 'Deliveries',
          tabBarIcon: ({ color, size }) => <Icon name="truck-delivery" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="DeliveryProfileTab"
        component={DeliveryProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Icon name="account-circle" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const DeliveryNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DeliveryTabs" component={DeliveryTabNavigator} />
      <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
    </Stack.Navigator>
  );
};
