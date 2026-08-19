import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Divider, useTheme } from 'react-native-paper';
import { orderApi } from '../../api/orderApi';
import { Order } from '../../types';
import { GradientHeader } from '../../components/common/GradientHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CURRENCY_SYMBOL } from '../../constants/config';

export const OrderDetailScreen = ({ route, navigation }: any) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();

  const loadOrder = async () => {
    try {
      const res = await orderApi.getOrderById(orderId);
      setOrder(res.data.order);
    } catch (err) {
      console.log('Error loading order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            await orderApi.cancelOrder(orderId);
            Alert.alert('Order Cancelled', 'Your order has been cancelled.');
            loadOrder();
          } catch (err: any) {
            Alert.alert('Cancellation Error', err.message || 'Cannot cancel order.');
          }
        },
      },
    ]);
  };

  if (loading || !order) {
    return (
      <View style={styles.container}>
        <GradientHeader title="Order Details" showBack onBackPress={() => navigation.goBack()} />
        <Text style={{ padding: 24 }}>Loading order details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientHeader title={`Order #${order.orderNumber}`} showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Header */}
        <Card style={styles.card}>
          <Card.Content style={styles.headerContent}>
            <View>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                Status: {order.orderStatus.replace(/_/g, ' ')}
              </Text>
              <Text variant="bodySmall" style={{ color: '#64748b' }}>
                Delivery Slot: {order.deliveryDate} ({order.deliveryTime})
              </Text>
            </View>
            <StatusBadge status={order.orderStatus} />
          </Card.Content>
        </Card>

        {/* OTP Badge */}
        {order.deliveryOtp && order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED' && (
          <Card style={[styles.card, { backgroundColor: '#e0f2fe' }]}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text variant="bodySmall" style={{ color: '#0369a1', fontWeight: 'bold' }}>
                SHARE THIS OTP WITH DELIVERY PERSON UPON ARRIVAL:
              </Text>
              <Text style={styles.otpText}>{order.deliveryOtp}</Text>
            </Card.Content>
          </Card>
        )}

        {/* Ordered Items */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 10 }}>
              Items Ordered
            </Text>
            {order.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={{ flex: 1, fontWeight: 'bold' }}>
                  {item.product?.name || 'Water Product'} x {item.quantity}
                </Text>
                <Text style={{ fontWeight: 'bold' }}>
                  {CURRENCY_SYMBOL}
                  {item.totalPrice.toFixed(2)}
                </Text>
              </View>
            ))}
            <Divider style={{ marginVertical: 10 }} />
            <View style={styles.summaryRow}>
              <Text>Subtotal</Text>
              <Text>
                {CURRENCY_SYMBOL}
                {order.subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Delivery Charge</Text>
              <Text>
                {CURRENCY_SYMBOL}
                {order.deliveryCharge.toFixed(2)}
              </Text>
            </View>
            {order.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={{ color: '#15803d' }}>Discount</Text>
                <Text style={{ color: '#15803d' }}>
                  - {CURRENCY_SYMBOL}
                  {order.discount.toFixed(2)}
                </Text>
              </View>
            )}
            <Divider style={{ marginVertical: 8 }} />
            <View style={styles.summaryRow}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                Total Paid
              </Text>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                {CURRENCY_SYMBOL}
                {order.totalAmount.toFixed(2)} ({order.paymentMethod})
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Delivery Address */}
        {order.address && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 6 }}>
                Delivery Location
              </Text>
              <Text style={{ fontWeight: 'bold' }}>{order.address.fullName}</Text>
              <Text variant="bodySmall" style={{ color: '#475569' }}>
                {order.address.houseBuilding}, {order.address.street}, {order.address.area},{' '}
                {order.address.city} - {order.address.pincode}
              </Text>
              <Text variant="bodySmall" style={{ color: '#64748b', marginTop: 4 }}>
                Phone: {order.address.phone}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
            style={{ borderRadius: 25, marginBottom: 10 }}
          >
            Track Order Timeline
          </Button>

          {order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED' ? (
            <Button
              mode="outlined"
              textColor="#ef4444"
              onPress={handleCancelOrder}
              style={{ borderRadius: 25, borderColor: '#ef4444' }}
            >
              Cancel Order
            </Button>
          ) : null}
        </View>
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
  card: {
    marginBottom: 12,
    borderRadius: 14,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  otpText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0284c7',
    letterSpacing: 4,
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  actionButtons: {
    marginTop: 10,
    marginBottom: 30,
  },
});
