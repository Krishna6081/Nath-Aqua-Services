import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Button, RadioButton, useTheme, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { GradientHeader } from '../../components/common/GradientHeader';
import { clearCart } from '../../redux/slices/cartSlice';
import { orderApi } from '../../api/orderApi';
import { addressApi } from '../../api/addressApi';
import { Address } from '../../types';
import { CURRENCY_SYMBOL } from '../../constants/config';
import { sendLocalNotification } from '../../notifications/notificationManager';

export const CheckoutScreen = ({ navigation }: any) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<string>('08:00 AM - 10:00 AM');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'ONLINE'>('COD');
  const [loading, setLoading] = useState<boolean>(false);

  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { items, appliedCoupon } = useSelector((state: RootState) => state.cart);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const deliveryCharge = items.reduce((sum, i) => sum + i.product.deliveryCharge, 0);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - discount);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await addressApi.getAddresses();
        setAddresses(res.data.addresses);
        if (res.data.addresses.length > 0) {
          const defaultAddr = res.data.addresses.find((a: Address) => a.isDefault) || res.data.addresses[0];
          setSelectedAddressId(defaultAddr.id);
        }
      } catch (err) {
        console.log('Error loading addresses:', err);
      }
    };
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      Alert.alert('Delivery Address Required', 'Please select or add a delivery address.');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        addressId: selectedAddressId,
        deliveryDate,
        deliveryTime: deliveryTimeSlot,
        paymentMethod,
        couponCode: appliedCoupon?.code,
      };

      const response = await orderApi.createOrder(orderPayload);
      const createdOrder = response.data.order;

      dispatch(clearCart());
      await sendLocalNotification(
        'Order Confirmed! 💧',
        `Your Nath Water Service order #${createdOrder.orderNumber} has been placed.`
      );

      Alert.alert('Order Successful 🎉', `Your order #${createdOrder.orderNumber} is confirmed!`, [
        {
          text: 'View Order Details',
          onPress: () => navigation.replace('OrderDetail', { orderId: createdOrder.id }),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Order Placement Failed', err.message || 'Unable to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Checkout & Place Order" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Address Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                1. Select Delivery Address
              </Text>
              <Button compact mode="text" onPress={() => navigation.navigate('AddEditAddress')}>
                + Add New
              </Button>
            </View>
            {addresses.length === 0 ? (
              <Text style={{ color: '#ef4444', marginVertical: 8 }}>
                No saved address found. Please add a delivery address first.
              </Text>
            ) : (
              addresses.map((addr) => (
                <TouchableOpacity
                  key={addr.id}
                  style={[
                    styles.addressItem,
                    selectedAddressId === addr.id && styles.selectedAddress,
                  ]}
                  onPress={() => setSelectedAddressId(addr.id)}
                >
                  <RadioButton
                    value={addr.id}
                    status={selectedAddressId === addr.id ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedAddressId(addr.id)}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold' }}>
                      {addr.fullName} ({addr.type})
                    </Text>
                    <Text variant="bodySmall" style={{ color: '#475569' }}>
                      {addr.houseBuilding}, {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                    </Text>
                    <Text variant="bodySmall" style={{ color: '#64748b' }}>
                      Phone: {addr.phone}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Delivery Slot Selector */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 10 }}>
              2. Delivery Date & Time Slot
            </Text>
            <Text variant="bodySmall" style={{ color: '#64748b', marginBottom: 6 }}>
              Select Time Slot for {deliveryDate}:
            </Text>
            {['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '02:00 PM - 04:00 PM', '05:00 PM - 07:00 PM'].map(
              (slot) => (
                <TouchableOpacity
                  key={slot}
                  style={styles.slotRow}
                  onPress={() => setDeliveryTimeSlot(slot)}
                >
                  <RadioButton
                    value={slot}
                    status={deliveryTimeSlot === slot ? 'checked' : 'unchecked'}
                    onPress={() => setDeliveryTimeSlot(slot)}
                  />
                  <Text style={{ fontWeight: deliveryTimeSlot === slot ? 'bold' : 'normal' }}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </Card.Content>
        </Card>

        {/* Payment Method Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 10 }}>
              3. Payment Method
            </Text>
            {[
              { key: 'COD', label: '💵 Cash on Delivery (Pay upon delivery)' },
              { key: 'UPI', label: '📱 UPI Payment (Google Pay / PhonePe / Paytm)' },
              { key: 'ONLINE', label: '💳 Credit / Debit Card / Netbanking (Razorpay)' },
            ].map((method) => (
              <TouchableOpacity
                key={method.key}
                style={styles.slotRow}
                onPress={() => setPaymentMethod(method.key as any)}
              >
                <RadioButton
                  value={method.key}
                  status={paymentMethod === method.key ? 'checked' : 'unchecked'}
                  onPress={() => setPaymentMethod(method.key as any)}
                />
                <Text style={{ fontWeight: paymentMethod === method.key ? 'bold' : 'normal' }}>
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>

        {/* Order Summary */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>
              Final Amount Breakdown
            </Text>
            <View style={styles.summaryRow}>
              <Text>Subtotal</Text>
              <Text>
                {CURRENCY_SYMBOL}
                {subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Delivery Charge</Text>
              <Text>
                {CURRENCY_SYMBOL}
                {deliveryCharge.toFixed(2)}
              </Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={{ color: '#15803d' }}>Discount</Text>
                <Text style={{ color: '#15803d' }}>
                  - {CURRENCY_SYMBOL}
                  {discount.toFixed(2)}
                </Text>
              </View>
            )}
            <Divider style={{ marginVertical: 8 }} />
            <View style={styles.summaryRow}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                Total Payable
              </Text>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                {CURRENCY_SYMBOL}
                {grandTotal.toFixed(2)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={loading}
          style={styles.placeOrderBtn}
          contentStyle={{ paddingVertical: 8 }}
        >
          PLACE ORDER ({CURRENCY_SYMBOL}
          {grandTotal.toFixed(2)})
        </Button>
      </View>
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
    paddingBottom: 100,
  },
  card: {
    marginBottom: 14,
    borderRadius: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginVertical: 4,
  },
  selectedAddress: {
    borderColor: '#0284c7',
    backgroundColor: '#f0f9ff',
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  placeOrderBtn: {
    borderRadius: 25,
  },
});
