import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { orderApi } from '../../api/orderApi';
import { Order } from '../../types';
import { GradientHeader } from '../../components/common/GradientHeader';
import { StatusBadge } from '../../components/common/StatusBadge';

export const DeliveryDashboardScreen = ({ navigation }: any) => {
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  const loadDeliveries = async () => {
    try {
      const res = await orderApi.getOrders();
      setAssignedOrders(res.data.orders);
    } catch (err) {
      console.log('Error fetching delivery staff orders:', err);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDeliveries();
    setRefreshing(false);
  };

  const pendingCount = assignedOrders.filter((o) => o.orderStatus !== 'DELIVERED').length;
  const completedCount = assignedOrders.filter((o) => o.orderStatus === 'DELIVERED').length;

  return (
    <View style={styles.container}>
      <GradientHeader title="Delivery Dashboard" subtitle={`Welcome, ${user?.name}`} />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Delivery Staff Metrics */}
        <View style={styles.statsRow}>
          <Card style={[styles.statCard, { backgroundColor: '#e0f2fe' }]}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: '#0369a1' }}>
                {pendingCount}
              </Text>
              <Text variant="bodySmall" style={{ color: '#0369a1', fontWeight: 'bold' }}>
                Pending Deliveries
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#dcfce7' }]}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: '#15803d' }}>
                {completedCount}
              </Text>
              <Text variant="bodySmall" style={{ color: '#15803d', fontWeight: 'bold' }}>
                Delivered Today
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Assigned Orders List */}
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#0f172a' }}>
            Assigned Active Deliveries
          </Text>
        </View>

        {assignedOrders.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#64748b', marginTop: 24 }}>
            No deliveries assigned to you right now.
          </Text>
        ) : (
          assignedOrders.map((order) => (
            <Card
              key={order.id}
              style={styles.orderCard}
              onPress={() => navigation.navigate('DeliveryDetail', { orderId: order.id })}
            >
              <Card.Content>
                <View style={styles.cardRow}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                    Order #{order.orderNumber}
                  </Text>
                  <StatusBadge status={order.orderStatus} />
                </View>
                <Text variant="bodyMedium" style={{ fontWeight: 'bold', marginTop: 4 }}>
                  Customer: {order.user?.name || 'Customer'} (📞 {order.user?.phone})
                </Text>
                <Text variant="bodySmall" style={{ color: '#475569', marginVertical: 4 }}>
                  📍 {order.address?.houseBuilding}, {order.address?.street}, {order.address?.area}
                </Text>
                <Button
                  mode="contained"
                  compact
                  style={{ marginTop: 8, borderRadius: 20 }}
                  onPress={() => navigation.navigate('DeliveryDetail', { orderId: order.id })}
                >
                  Manage & Complete Delivery
                </Button>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  orderCard: {
    marginBottom: 12,
    borderRadius: 14,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
