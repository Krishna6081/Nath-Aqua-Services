import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, Menu } from 'react-native-paper';
import { orderApi } from '../../api/orderApi';
import { Order } from '../../types';
import { GradientHeader } from '../../components/common/GradientHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CURRENCY_SYMBOL } from '../../constants/config';

export const AdminOrdersScreen = ({ navigation }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getOrders();
      setOrders(res.data.orders);
    } catch (err) {
      console.log('Error loading admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await orderApi.updateOrderStatus(id, { status });
      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="System Orders Management" showBack onBackPress={() => navigation.goBack()} />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={loadOrders}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.row}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  #{item.orderNumber}
                </Text>
                <StatusBadge status={item.orderStatus} />
              </View>
              <Text variant="bodySmall" style={{ color: '#64748b', marginVertical: 4 }}>
                Customer: {item.user?.name} ({item.user?.phone})
              </Text>
              <Text variant="bodySmall" style={{ color: '#0369a1' }}>
                Delivery Slot: {item.deliveryDate} ({item.deliveryTime})
              </Text>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', marginTop: 4, color: '#0284c7' }}>
                {CURRENCY_SYMBOL}
                {item.totalAmount.toFixed(2)} ({item.paymentMethod})
              </Text>

              <View style={styles.actions}>
                {item.orderStatus === 'PENDING' && (
                  <Button compact mode="contained" onPress={() => handleUpdateStatus(item.id, 'CONFIRMED')}>
                    Confirm Order
                  </Button>
                )}
                {item.orderStatus === 'CONFIRMED' && (
                  <Button compact mode="contained" onPress={() => handleUpdateStatus(item.id, 'PREPARING')}>
                    Prepare Order
                  </Button>
                )}
                {item.orderStatus === 'PREPARING' && (
                  <Button compact mode="contained" onPress={() => handleUpdateStatus(item.id, 'OUT_FOR_DELIVERY')}>
                    Out for Delivery
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
