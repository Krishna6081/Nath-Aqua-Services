import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Text, Button, Menu } from 'react-native-paper';
import { orderApi } from '../../api/orderApi';
import { adminApi } from '../../api/adminApi';
import { Order } from '../../types';
import { GradientHeader } from '../../components/common/GradientHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CURRENCY_SYMBOL } from '../../constants/config';

export const AdminOrdersScreen = ({ navigation }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisibleId, setMenuVisibleId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resOrders, resStaff] = await Promise.all([
        orderApi.getOrders(),
        adminApi.getDeliveryStaff(),
      ]);
      setOrders(resOrders.data.orders);
      setStaffList(resStaff.data.staff);
    } catch (err) {
      console.log('Error loading admin orders/staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await orderApi.updateOrderStatus(id, { status });
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not update order status');
    }
  };

  const handleAssignStaff = async (orderId: string, deliveryPersonId: string) => {
    try {
      await orderApi.updateOrderStatus(orderId, { status: 'ASSIGNED', deliveryPersonId });
      setMenuVisibleId(null);
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not assign delivery executive');
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
        onRefresh={loadData}
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
              {item.deliveryPerson && (
                <Text variant="bodySmall" style={{ color: '#16a34a', fontWeight: 'bold', marginTop: 2 }}>
                  Assigned Staff: 🚚 {item.deliveryPerson.name} ({item.deliveryPerson.phone})
                </Text>
              )}
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
                {(item.orderStatus === 'CONFIRMED' || item.orderStatus === 'PREPARING') && (
                  <Menu
                    visible={menuVisibleId === item.id}
                    onDismiss={() => setMenuVisibleId(null)}
                    anchor={
                      <Button compact mode="outlined" onPress={() => setMenuVisibleId(item.id)}>
                        Assign Staff ▾
                      </Button>
                    }
                  >
                    {staffList.map((staff) => (
                      <Menu.Item
                        key={staff.id}
                        onPress={() => handleAssignStaff(item.id, staff.id)}
                        title={`Assign ${staff.name}`}
                      />
                    ))}
                  </Menu>
                )}
                {item.orderStatus === 'ASSIGNED' && (
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
    gap: 8,
  },
});
