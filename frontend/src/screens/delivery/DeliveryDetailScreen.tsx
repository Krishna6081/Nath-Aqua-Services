import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, TextInput, useTheme } from 'react-native-paper';
import { orderApi } from '../../api/orderApi';
import { Order } from '../../types';
import { GradientHeader } from '../../components/common/GradientHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CURRENCY_SYMBOL } from '../../constants/config';

export const DeliveryDetailScreen = ({ route, navigation }: any) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  const loadOrder = async () => {
    try {
      const res = await orderApi.getOrderById(orderId);
      setOrder(res.data.order);
    } catch (err) {
      console.log('Error loading delivery detail:', err);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const handleUpdateStatus = async (status: string) => {
    try {
      await orderApi.updateOrderStatus(orderId, { status });
      Alert.alert('Status Updated', `Delivery status changed to ${status}`);
      loadOrder();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not update status');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput || otpInput.length !== 4) {
      Alert.alert('Validation Error', 'Please enter 4-digit OTP provided by customer.');
      return;
    }
    setLoading(true);
    try {
      await orderApi.verifyDeliveryOtp(orderId, otpInput);
      Alert.alert('Delivery Verified 🎉', 'OTP verified successfully! Order marked as DELIVERED.');
      loadOrder();
    } catch (err: any) {
      Alert.alert('Verification Failed', err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <GradientHeader title="Delivery Details" showBack onBackPress={() => navigation.goBack()} />
        <Text style={{ padding: 24 }}>Loading delivery details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientHeader title={`Delivery #${order.orderNumber}`} showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Card */}
        <Card style={styles.card}>
          <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                Status: {order.orderStatus.replace(/_/g, ' ')}
              </Text>
              <Text variant="bodySmall" style={{ color: '#64748b' }}>
                Collect Payment: {order.paymentMethod === 'COD' ? `₹${order.totalAmount} (COD)` : 'PAID ONLINE'}
              </Text>
            </View>
            <StatusBadge status={order.orderStatus} />
          </Card.Content>
        </Card>

        {/* Customer Location */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 6 }}>
              Customer Details & Address
            </Text>
            <Text style={{ fontWeight: 'bold' }}>{order.address?.fullName || order.user?.name}</Text>
            <Text variant="bodySmall" style={{ color: '#0284c7', fontWeight: 'bold', marginVertical: 4 }}>
              📞 Phone: {order.address?.phone || order.user?.phone}
            </Text>
            <Text variant="bodyMedium" style={{ color: '#475569' }}>
              📍 {order.address?.houseBuilding}, {order.address?.street}, {order.address?.area},{' '}
              {order.address?.city} - {order.address?.pincode}
            </Text>
          </Card.Content>
        </Card>

        {/* Deliver Items */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>
              Items to Deliver
            </Text>
            {order.items.map((i) => (
              <Text key={i.id} style={{ fontWeight: 'bold', marginVertical: 2 }}>
                • {i.product?.name} x {i.quantity} ({i.product?.capacity})
              </Text>
            ))}
          </Card.Content>
        </Card>

        {/* Delivery OTP Verification */}
        {order.orderStatus !== 'DELIVERED' && (
          <Card style={[styles.card, { borderColor: '#0284c7', borderWidth: 2 }]}>
            <Card.Content>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>
                Verify Customer OTP & Complete Delivery
              </Text>
              <TextInput
                label="Enter 4-Digit Customer OTP"
                value={otpInput}
                onChangeText={setOtpInput}
                keyboardType="numeric"
                maxLength={4}
                mode="outlined"
                style={{ marginBottom: 12 }}
              />
              <Button
                mode="contained"
                onPress={handleVerifyOtp}
                loading={loading}
                disabled={loading}
                style={{ borderRadius: 25 }}
              >
                VERIFY OTP & MARK DELIVERED
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Delivery Actions */}
        {order.orderStatus !== 'DELIVERED' && (
          <View style={styles.actionRow}>
            <Button
              mode="outlined"
              onPress={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
              style={{ flex: 1, borderRadius: 20 }}
            >
              Start Delivery
            </Button>
          </View>
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
    paddingBottom: 40,
  },
  card: {
    marginBottom: 14,
    borderRadius: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
});
