import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, SegmentedButtons } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchOrders } from '../../redux/slices/orderSlice';
import { GradientHeader } from '../../components/common/GradientHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CURRENCY_SYMBOL } from '../../constants/config';

export const CustomerOrdersScreen = ({ navigation }: any) => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const dispatch = useDispatch<AppDispatch>();
  const { orders, isLoading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders(undefined));
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ACTIVE') {
      return o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED';
    }
    if (filterStatus === 'DELIVERED') {
      return o.orderStatus === 'DELIVERED';
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <GradientHeader title="My Water Orders" subtitle="Track and view past order history" />

      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filterStatus}
          onValueChange={setFilterStatus}
          buttons={[
            { value: 'ALL', label: 'All Orders' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'DELIVERED', label: 'Completed' },
          ]}
        />
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={() => dispatch(fetchOrders(undefined))}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
          >
            <Card.Content>
              <View style={styles.headerRow}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  Order #{item.orderNumber}
                </Text>
                <StatusBadge status={item.orderStatus} />
              </View>
              <Text variant="bodySmall" style={{ color: '#64748b', marginVertical: 4 }}>
                Delivery Date: {item.deliveryDate} ({item.deliveryTime})
              </Text>
              <View style={styles.footerRow}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#0284c7' }}>
                  {CURRENCY_SYMBOL}
                  {item.totalAmount.toFixed(2)} ({item.items.length} Items)
                </Text>
                <Button compact mode="text">
                  Details ➔
                </Button>
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
  filterContainer: {
    padding: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 12,
    borderRadius: 14,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
  },
});
