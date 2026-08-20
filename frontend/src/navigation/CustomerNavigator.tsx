import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screen imports
import { HomeScreen } from '../screens/customer/HomeScreen';
import { WaterServicesScreen } from '../screens/customer/WaterServicesScreen';
import { CustomerOrdersScreen } from '../screens/customer/CustomerOrdersScreen';
import { SubscriptionsScreen } from '../screens/customer/SubscriptionsScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { ProductDetailScreen } from '../screens/customer/ProductDetailScreen';
import { CartScreen } from '../screens/customer/CartScreen';
import { CheckoutScreen } from '../screens/customer/CheckoutScreen';
import { OrderDetailScreen } from '../screens/customer/OrderDetailScreen';
import { OrderTrackingScreen } from '../screens/customer/OrderTrackingScreen';
import { CreateSubscriptionScreen } from '../screens/customer/CreateSubscriptionScreen';
import { AddressListScreen } from '../screens/customer/AddressListScreen';
import { AddEditAddressScreen } from '../screens/customer/AddEditAddressScreen';
import { NotificationsScreen } from '../screens/customer/NotificationsScreen';
import { HelpSupportScreen } from '../screens/customer/HelpSupportScreen';
import { AboutScreen } from '../screens/customer/AboutScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomerTabNavigator = () => {
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
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ServicesTab"
        component={WaterServicesScreen}
        options={{
          tabBarLabel: 'Water Services',
          tabBarIcon: ({ color, size }) => <Icon name="water" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={CustomerOrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => <Icon name="clipboard-text" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="SubscriptionsTab"
        component={SubscriptionsScreen}
        options={{
          tabBarLabel: 'Subscriptions',
          tabBarIcon: ({ color, size }) => <Icon name="calendar-repeat" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Icon name="account" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const CustomerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomerTabs" component={CustomerTabNavigator} />
      <Stack.Screen name="WaterServices" component={WaterServicesScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="CreateSubscription" component={CreateSubscriptionScreen} />
      <Stack.Screen name="AddressList" component={AddressListScreen} />
      <Stack.Screen name="AddEditAddress" component={AddEditAddressScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
};

