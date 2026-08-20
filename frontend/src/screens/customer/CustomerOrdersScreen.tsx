import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, SegmentedButtons, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchOrders } from '../../redux/slices/orderSlice';
import { GradientHeader } from '../../components/common/GradientHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CURRENCY_SYMBOL } from '../../constants/config';

export const CustomerOrdersScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const { orders, isLoading } = useSelector((state: RootState) => state.orders);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchOrders(undefined));
    }, [dispatch])
  );

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ACTIVE') {
      return (
        o.orderStatus !== 'DELIVERED' &&
        o.orderStatus !== 'CANCELLED' &&
        o.orderStatus !== 'FAILED_DELIVERY'
      );
    }
    if (filterStatus === 'DELIVERED') {
      return o.orderStatus === 'DELIVERED';
    }
    return true;
  });

  const handleNavigateToWaterServices = () => {
    try {
      navigation.navigate('ServicesTab');
    } catch (e) {
      navigation.navigate('WaterServices');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 56, marginBottom: 12 }}>📦</Text>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onBackground }}>
                No Orders Found
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline, textAlign: 'center', marginTop: 4, marginBottom: 18 }}>
                {filterStatus === 'ALL'
                  ? "You haven't placed any water orders yet."
                  : `No ${filterStatus.toLowerCase()} orders at the moment.`}
              </Text>
              <Button
                mode="contained"
                style={{ borderRadius: 14, backgroundColor: theme.colors.primary }}
                contentStyle={{ height: 44, paddingHorizontal: 16 }}
                labelStyle={{ fontWeight: 'bold' }}
                onPress={handleNavigateToWaterServices}
              >
                Order Water Now
              </Button>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
          >
            <Card.Content>
              <View style={styles.headerRow}>
                <View>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                    Order #{item.orderNumber}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    {item.deliveryDate} ({item.deliveryTime})
                  </Text>
                </View>
                <StatusBadge status={item.orderStatus} />
              </View>

              <View style={styles.footerRow}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                  {CURRENCY_SYMBOL}
                  {item.totalAmount ? item.totalAmount.toFixed(2) : '0.00'} ({item.items ? item.items.length : 0} Items)
                </Text>
                <Button compact mode="text" labelStyle={{ fontWeight: '700' }}>
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
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  card: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
});
