import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Linking } from 'react-native';
import { Text, Card, Button, TextInput, useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
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

  const handleCallCustomer = (phone?: string) => {
    if (!phone) {
      Alert.alert('No Phone Number', 'Customer phone number is not available.');
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call.');
    });
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await orderApi.updateOrderStatus(orderId, { status });
      Alert.alert('Status Updated 🎉', `Delivery status changed to ${status.replace(/_/g, ' ')}.`);
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
      Alert.alert('Delivery Verified 🎉', 'OTP verified successfully! Order marked as DELIVERED.', [
        {
          text: 'Back to Dashboard',
          onPress: () => navigation.goBack(),
        },
      ]);
      loadOrder();
    } catch (err: any) {
      Alert.alert('Verification Failed', err.response?.data?.message || err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <GradientHeader title="Delivery Details" showBack onBackPress={() => navigation.goBack()} />
        <Text style={{ padding: 24, textAlign: 'center' }}>Loading delivery details...</Text>
      </View>
    );
  }

  const customerPhone = order.address?.phone || order.user?.phone;
  const customerName = order.address?.fullName || order.user?.name || 'Customer';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GradientHeader title={`Delivery #${order.orderNumber}`} showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Status & Payment Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ fontWeight: '800', color: theme.colors.onSurface }}>
                Status: {order.orderStatus.replace(/_/g, ' ')}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '700', marginTop: 2 }}>
                Payment: {order.paymentMethod === 'COD' ? `₹${order.totalAmount} (COLLECT CASH ON DELIVERY)` : 'ONLINE PAID'}
              </Text>
            </View>
            <StatusBadge status={order.orderStatus} />
          </Card.Content>
        </Card>

        {/* Customer Location & Contact */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.cardHeaderRow}>
              <Text variant="titleMedium" style={{ fontWeight: '800', color: theme.colors.onSurface }}>
                Customer & Delivery Location
              </Text>
              {customerPhone && (
                <TouchableOpacity style={styles.callButton} onPress={() => handleCallCustomer(customerPhone)}>
                  <Icon name="phone" size={14} color="#ffffff" />
                  <Text style={styles.callButtonText}>Call Customer</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text variant="titleSmall" style={{ fontWeight: '700', color: theme.colors.onSurface, marginTop: 8 }}>
              👤 {customerName}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '700', marginVertical: 2 }}>
              📞 Phone: {customerPhone || 'Not set'}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              📍 {order.address?.houseBuilding}, {order.address?.street}, {order.address?.area},{' '}
              {order.address?.city} - {order.address?.pincode}
            </Text>
          </Card.Content>
        </Card>

        {/* Items to Deliver */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: '800', color: theme.colors.onSurface, marginBottom: 8 }}>
              Items to Deliver
            </Text>
            {order.items.map((i) => (
              <View key={i.id} style={styles.itemRow}>
                <Text style={{ fontSize: 20 }}>🚰</Text>
                <View style={{ flex: 1 }}>
                  <Text variant="titleSmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                    {i.product?.name || 'Water Can'} × {i.quantity}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    Unit price: ₹{i.unitPrice} • Capacity: {i.product?.capacity || 'Standard'}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Delivery OTP Verification */}
        {order.orderStatus !== 'DELIVERED' && (
          <Card style={[styles.otpCard, { backgroundColor: '#f0f9ff' }]}>
            <Card.Content>
              <Text variant="titleMedium" style={{ fontWeight: '800', color: '#0369a1', marginBottom: 4 }}>
                Verify Customer OTP & Complete Delivery
              </Text>
              <Text variant="bodySmall" style={{ color: '#475569', marginBottom: 12 }}>
                Ask customer for 4-digit OTP shown on their active order card:
              </Text>

              <TextInput
                label="Enter 4-Digit Customer OTP *"
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
                style={{ borderRadius: 16, backgroundColor: '#059669' }}
                contentStyle={{ height: 46 }}
                labelStyle={{ fontWeight: '800' }}
                icon="shield-key"
              >
                VERIFY OTP & MARK DELIVERED
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Delivery Actions */}
        {order.orderStatus !== 'DELIVERED' && (
          <View style={styles.actionRow}>
            {order.orderStatus !== 'OUT_FOR_DELIVERY' && (
              <Button
                mode="contained"
                onPress={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
                style={{ flex: 1, borderRadius: 16, backgroundColor: '#0284c7' }}
                contentStyle={{ height: 44 }}
                labelStyle={{ fontWeight: '800' }}
                icon="truck-fast"
              >
                Start Delivery Route
              </Button>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 14,
    borderRadius: 18,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  otpCard: {
    marginBottom: 14,
    borderRadius: 18,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#0284c7',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  callButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
});
