import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeColor = () => {
    switch (status) {
      case 'DELIVERED':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'OUT_FOR_DELIVERY':
        return { bg: '#e0f2fe', text: '#0369a1' };
      case 'CONFIRMED':
      case 'PREPARING':
      case 'ASSIGNED':
        return { bg: '#fef3c7', text: '#b45309' };
      case 'CANCELLED':
      case 'FAILED_DELIVERY':
        return { bg: '#fee2e2', text: '#b91c1c' };
      default:
        return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const { bg, text } = getBadgeColor();

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: text }]}>{status.replace(/_/g, ' ')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
