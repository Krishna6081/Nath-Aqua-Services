import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Linking, Alert } from 'react-native';
import { Text, Card, Button, useTheme, Avatar, SegmentedButtons } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { RootState } from '../../redux/store';
import { orderApi } from '../../api/orderApi';
import { Order } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const DeliveryDashboardScreen = ({ navigation }: any) => {
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getOrders();
      if (res.data && res.data.orders) {
        setAssignedOrders(res.data.orders);
      }
    } catch (err) {
      console.log('Error fetching delivery staff orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDeliveries();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDeliveries();
    setRefreshing(false);
  };

  const handleCallCustomer = (phone?: string) => {
    if (!phone) {
      Alert.alert('No Phone Number', 'Customer phone number is not available.');
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call.');
    });
  };

  const handleStartDelivery = async (orderId: string) => {
    try {
      await orderApi.updateOrderStatus(orderId, { status: 'OUT_FOR_DELIVERY' });
      Alert.alert('Out for Delivery 🚚', 'Order status updated to Out for Delivery.');
      loadDeliveries();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not update delivery status.');
    }
  };

  const filteredOrders = assignedOrders.filter((o) => {
    if (filterStatus === 'PENDING') return o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED';
    if (filterStatus === 'OUT') return o.orderStatus === 'OUT_FOR_DELIVERY';
    if (filterStatus === 'DELIVERED') return o.orderStatus === 'DELIVERED';
    return true;
  });

  const pendingCount = assignedOrders.filter((o) => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED').length;
  const outCount = assignedOrders.filter((o) => o.orderStatus === 'OUT_FOR_DELIVERY').length;
  const completedCount = assignedOrders.filter((o) => o.orderStatus === 'DELIVERED').length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Modern Delivery Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerRow}>
          <View>
            <Text variant="titleMedium" style={styles.greeting}>
              Hello, {user?.name || 'Driver'} 🚚
            </Text>
            <View style={styles.statusPill}>
              <View style={styles.activeDot} />
              <Text style={styles.statusText}>On Duty • Ready for Express Delivery</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('DeliveryProfileTab')}>
            <Avatar.Text
              size={44}
              label={user?.name ? user.name.slice(0, 2).toUpperCase() : 'DP'}
              style={{ backgroundColor: '#ffffff' }}
              labelStyle={{ color: '#0284c7', fontWeight: 'bold' }}
            />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{outCount}</Text>
            <Text style={styles.statLabel}>On Route</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <SegmentedButtons
          value={filterStatus}
          onValueChange={setFilterStatus}
          buttons={[
            { value: 'ALL', label: 'All' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'OUT', label: 'On Route' },
            { value: 'DELIVERED', label: 'Completed' },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >
        {filteredOrders.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🚚</Text>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onBackground }}>
              No Deliveries Found
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.outline, textAlign: 'center', marginTop: 4 }}>
              New assigned water delivery orders will appear here.
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const customerName = order.address?.fullName || order.user?.name || 'Customer';
            const customerPhone = order.address?.phone || order.user?.phone;
            const itemsSummary = order.items && order.items.length > 0
              ? order.items.map((i) => `${i.product?.name || 'Water Can'} × ${i.quantity}`).join(', ')
              : 'Water Delivery';

            return (
              <Card
                key={order.id}
                style={[styles.orderCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => navigation.navigate('DeliveryDetail', { orderId: order.id })}
              >
                <Card.Content>
                  <View style={styles.cardHeaderRow}>
                    <View>
                      <Text variant="titleMedium" style={{ fontWeight: '800', color: theme.colors.onSurface }}>
                        Order #{order.orderNumber}
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                        {order.deliveryDate} • {order.deliveryTime}
                      </Text>
                    </View>
                    <StatusBadge status={order.orderStatus} />
                  </View>

                  <View style={styles.customerBox}>
                    <View style={styles.customerHeader}>
                      <Icon name="account-circle-outline" size={20} color="#0284c7" />
                      <Text variant="titleSmall" style={{ fontWeight: '700', color: '#0f172a', flex: 1 }}>
                        {customerName}
                      </Text>
                      {customerPhone && (
                        <TouchableOpacity
                          style={styles.callBtn}
                          onPress={() => handleCallCustomer(customerPhone)}
                        >
                          <Icon name="phone" size={14} color="#ffffff" />
                          <Text style={styles.callBtnText}>Call</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.addressRow}>
                      <Icon name="map-marker-outline" size={16} color="#64748b" />
                      <Text variant="bodySmall" style={styles.addressText} numberOfLines={2}>
                        {order.address?.houseBuilding}, {order.address?.street}, {order.address?.area}, {order.address?.city}
                      </Text>
                    </View>

                    <View style={styles.itemRow}>
                      <Icon name="water-outline" size={16} color="#0284c7" />
                      <Text variant="bodySmall" style={{ fontWeight: '700', color: '#0369a1', flex: 1 }}>
                        {itemsSummary}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardActions}>
                    {order.orderStatus === 'CONFIRMED' || order.orderStatus === 'ASSIGNED' || order.orderStatus === 'PREPARING' ? (
                      <Button
                        mode="contained"
                        compact
                        icon="truck-fast"
                        style={{ borderRadius: 12, backgroundColor: '#0284c7' }}
                        labelStyle={{ fontWeight: '700' }}
                        onPress={() => handleStartDelivery(order.id)}
                      >
                        Start Delivery
                      </Button>
                    ) : null}

                    <Button
                      mode={order.orderStatus === 'OUT_FOR_DELIVERY' ? 'contained' : 'outlined'}
                      compact
                      icon="shield-key"
                      style={[
                        { borderRadius: 12 },
                        order.orderStatus === 'OUT_FOR_DELIVERY' && { backgroundColor: '#059669' },
                      ]}
                      labelStyle={{ fontWeight: '700' }}
                      onPress={() => navigation.navigate('DeliveryDetail', { orderId: order.id })}
                    >
                      {order.orderStatus === 'OUT_FOR_DELIVERY' ? 'Verify OTP & Complete' : 'View Details'}
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 45,
    paddingHorizontal: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#ffffff',
    fontWeight: '800',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34d399',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: '#e0f2fe',
    fontSize: 11,
    fontWeight: '600',
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  orderCard: {
    marginBottom: 12,
    borderRadius: 18,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    gap: 6,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  callBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  addressText: {
    color: '#475569',
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
});
