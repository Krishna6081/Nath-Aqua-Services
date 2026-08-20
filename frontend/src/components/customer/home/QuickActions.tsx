import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface QuickActionsProps {
  onOrderWater: () => void;
  onMyOrders: () => void;
  onSubscriptions: () => void;
  onAddresses: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOrderWater,
  onMyOrders,
  onSubscriptions,
  onAddresses,
}) => {
  const theme = useTheme();

  const actions = [
    {
      id: 'order',
      label: 'Order Water',
      icon: 'water',
      color: '#0284c7',
      bgColor: '#e0f2fe',
      onPress: onOrderWater,
    },
    {
      id: 'orders',
      label: 'My Orders',
      icon: 'package-variant-closed',
      color: '#0891b2',
      bgColor: '#cffaff',
      onPress: onMyOrders,
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: 'calendar-repeat',
      color: '#0284c7',
      bgColor: '#e0f2fe',
      onPress: onSubscriptions,
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: 'map-marker-outline',
      color: '#2563eb',
      bgColor: '#dbeafe',
      onPress: onAddresses,
    },
  ];

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
        Quick Actions
      </Text>
      <View style={styles.grid}>
        {actions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            activeOpacity={0.7}
            onPress={item.onPress}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
              <Icon name={item.icon as any} size={26} color={item.color} />
            </View>
            <Text variant="labelMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
  },
});
