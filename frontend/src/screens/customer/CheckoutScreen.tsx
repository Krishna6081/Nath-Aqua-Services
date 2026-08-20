import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, Clipboard, Linking } from 'react-native';
import { Text, Card, Button, RadioButton, useTheme, Divider, TextInput } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
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
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiUtr, setUpiUtr] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC');
  const [loading, setLoading] = useState<boolean>(false);

  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { items, appliedCoupon } = useSelector((state: RootState) => state.cart);

  const merchantUpiId = 'brjadhav1982@ybl';

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const deliveryCharge = items.reduce((sum, i) => sum + i.product.deliveryCharge, 0);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - discount);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await addressApi.getAddresses();
        if (res.data && res.data.addresses) {
          setAddresses(res.data.addresses);
          if (res.data.addresses.length > 0) {
            const defaultAddr = res.data.addresses.find((a: Address) => a.isDefault) || res.data.addresses[0];
            setSelectedAddressId(defaultAddr.id);
          }
        }
      } catch (err) {
        console.log('Error loading addresses:', err);
      }
    };
    fetchAddresses();
  }, []);

  const handleCopyUpiId = () => {
    Clipboard.setString(merchantUpiId);
    Alert.alert('Copied to Clipboard! 📋', `UPI ID "${merchantUpiId}" copied.`);
  };

  const handleOpenUpiApp = (appName: 'PhonePe' | 'GPay' | 'Paytm' | 'Generic') => {
    const amount = grandTotal.toFixed(2);
    const merchantName = 'Nath Water Service';
    const note = 'Nath Water Delivery Payment';

    let deepLink = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    if (appName === 'PhonePe') {
      deepLink = `phonepe://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    } else if (appName === 'GPay') {
      deepLink = `tez://upi/pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    } else if (appName === 'Paytm') {
      deepLink = `paytmmp://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    }

    Linking.canOpenURL(deepLink)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(deepLink);
        } else {
          const fallback = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
          return Linking.openURL(fallback);
        }
      })
      .catch(() => {
        Clipboard.setString(merchantUpiId);
        Alert.alert(
          'UPI Payment',
          `UPI ID "${merchantUpiId}" copied to clipboard! Please open ${appName} and enter UPI ID to pay ₹${amount}.`
        );
      });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      Alert.alert('Delivery Address Required', 'Please select or add a delivery address first.');
      return;
    }

    if (paymentMethod === 'CARD') {
      if (!cardNumber || cardNumber.length < 16) {
        Alert.alert('Card Details Required', 'Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry || !cardCvv) {
        Alert.alert('Card Details Required', 'Please enter valid Expiry Date and CVV.');
        return;
      }
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
        upiUtr: paymentMethod === 'UPI' ? upiUtr : undefined,
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
      Alert.alert('Order Placement Failed', err.response?.data?.message || err.message || 'Unable to place order.');
    } finally {
      setLoading(false);
    }
  };

  const popularBanks = [
    { id: 'HDFC', name: 'HDFC Bank' },
    { id: 'SBI', name: 'State Bank of India' },
    { id: 'ICICI', name: 'ICICI Bank' },
    { id: 'AXIS', name: 'Axis Bank' },
    { id: 'KOTAK', name: 'Kotak Bank' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GradientHeader title="Checkout & Place Order" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 1. Address Selection */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={{ fontWeight: '800', color: theme.colors.onSurface }}>
                1. Select Delivery Address
              </Text>
              <Button compact mode="text" labelStyle={{ fontWeight: '700' }} onPress={() => navigation.navigate('AddEditAddress')}>
                + Add New
              </Button>
            </View>
            {addresses.length === 0 ? (
              <Text style={{ color: theme.colors.error, marginVertical: 8 }}>
                No saved address found. Please add a delivery address first.
              </Text>
            ) : (
              addresses.map((addr) => (
                <TouchableOpacity
                  key={addr.id}
                  activeOpacity={0.8}
                  style={[
                    styles.addressItem,
                    selectedAddressId === addr.id && { borderColor: theme.colors.primary, backgroundColor: '#f0f9ff', borderWidth: 2 },
                  ]}
                  onPress={() => setSelectedAddressId(addr.id)}
                >
                  <RadioButton
                    value={addr.id}
                    status={selectedAddressId === addr.id ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedAddressId(addr.id)}
                    color={theme.colors.primary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                      {addr.fullName} ({addr.type})
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {addr.houseBuilding}, {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      Phone: {addr.phone}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </Card.Content>
        </Card>

        {/* 2. Delivery Time Slot Selector */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: '800', color: theme.colors.onSurface, marginBottom: 10 }}>
              2. Preferred Delivery Time Slot
            </Text>
            {['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '02:00 PM - 04:00 PM', '05:00 PM - 07:00 PM'].map(
              (slot) => (
                <TouchableOpacity
                  key={slot}
                  activeOpacity={0.8}
                  style={styles.slotRow}
                  onPress={() => setDeliveryTimeSlot(slot)}
                >
                  <RadioButton
                    value={slot}
                    status={deliveryTimeSlot === slot ? 'checked' : 'unchecked'}
                    onPress={() => setDeliveryTimeSlot(slot)}
                    color={theme.colors.primary}
                  />
                  <Text style={{ fontWeight: deliveryTimeSlot === slot ? '700' : '500', color: theme.colors.onSurface }}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </Card.Content>
        </Card>

        {/* 3. Payment Method Selection */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: '800', color: theme.colors.onSurface, marginBottom: 12 }}>
              3. Select Payment Method
            </Text>

            {/* UPI Option */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.methodOption,
                paymentMethod === 'UPI' && { borderColor: theme.colors.primary, backgroundColor: '#f0f9ff', borderWidth: 2 },
              ]}
              onPress={() => setPaymentMethod('UPI')}
            >
              <View style={styles.methodHeader}>
                <RadioButton
                  value="UPI"
                  status={paymentMethod === 'UPI' ? 'checked' : 'unchecked'}
                  onPress={() => setPaymentMethod('UPI')}
                  color={theme.colors.primary}
                />
                <Icon name="qrcode-scan" size={22} color="#0284c7" />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text variant="titleSmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                    UPI / QR Code (Instant Scan & Pay)
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    Google Pay, PhonePe, Paytm, BHIM UPI
                  </Text>
                </View>
              </View>

              {paymentMethod === 'UPI' && (
                <View style={styles.upiDetailsBox}>
                  <Text variant="titleSmall" style={{ fontWeight: '800', color: '#0369a1', textAlign: 'center' }}>
                    Scan QR Code to Pay ₹{grandTotal.toFixed(2)}
                  </Text>

                  {/* Actual Merchant SBI QR Code Image */}
                  <View style={styles.qrContainer}>
                    <View style={styles.qrBox}>
                      <Image
                        source={require('../../../assets/images/upi_qr.jpg')}
                        style={styles.qrImage}
                        resizeMode="contain"
                      />
                      <Text style={styles.bankNameText}>State Bank of India - 6294</Text>
                    </View>
                  </View>

                  {/* UPI ID Row */}
                  <View style={styles.upiIdRow}>
                    <Text variant="bodySmall" style={{ color: '#475569', fontWeight: '600' }}>UPI ID:</Text>
                    <Text variant="bodyMedium" style={{ fontWeight: '800', color: '#0284c7' }}>{merchantUpiId}</Text>
                    <TouchableOpacity style={styles.copyBtn} onPress={handleCopyUpiId}>
                      <Icon name="content-copy" size={14} color="#ffffff" />
                      <Text style={styles.copyBtnText}>Copy</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Fast Direct App Launch Buttons */}
                  <Text variant="titleSmall" style={{ fontWeight: '800', color: '#0f172a', marginTop: 12, marginBottom: 8, textAlign: 'center' }}>
                    Or Tap to Pay Directly with Installed App:
                  </Text>
                  <View style={styles.upiAppsRow}>
                    <TouchableOpacity style={[styles.upiAppBtn, { backgroundColor: '#5f259f' }]} onPress={() => handleOpenUpiApp('PhonePe')}>
                      <Icon name="cellphone-text" size={16} color="#ffffff" />
                      <Text style={styles.upiAppBtnText}>PhonePe</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.upiAppBtn, { backgroundColor: '#1a73e8' }]} onPress={() => handleOpenUpiApp('GPay')}>
                      <Icon name="google" size={16} color="#ffffff" />
                      <Text style={styles.upiAppBtnText}>Google Pay</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.upiAppBtn, { backgroundColor: '#00baf2' }]} onPress={() => handleOpenUpiApp('Paytm')}>
                      <Icon name="wallet" size={16} color="#ffffff" />
                      <Text style={styles.upiAppBtnText}>Paytm</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.upiAppBtn, { backgroundColor: '#0f172a' }]} onPress={() => handleOpenUpiApp('Generic')}>
                      <Icon name="launch" size={16} color="#ffffff" />
                      <Text style={styles.upiAppBtnText}>Other UPI</Text>
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    label="Transaction UTR / Reference No. (Optional)"
                    value={upiUtr}
                    onChangeText={setUpiUtr}
                    mode="outlined"
                    placeholder="e.g., 324156789012"
                    keyboardType="numeric"
                    style={{ marginTop: 14, backgroundColor: '#ffffff' }}
                  />
                </View>
              )}
            </TouchableOpacity>

            {/* Credit / Debit Card Option */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.methodOption,
                paymentMethod === 'CARD' && { borderColor: theme.colors.primary, backgroundColor: '#f0f9ff', borderWidth: 2 },
              ]}
              onPress={() => setPaymentMethod('CARD')}
            >
              <View style={styles.methodHeader}>
                <RadioButton
                  value="CARD"
                  status={paymentMethod === 'CARD' ? 'checked' : 'unchecked'}
                  onPress={() => setPaymentMethod('CARD')}
                  color={theme.colors.primary}
                />
                <Icon name="credit-card-outline" size={22} color="#2563eb" />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text variant="titleSmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                    Credit / Debit Card
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    Visa, MasterCard, RuPay, Maestro
                  </Text>
                </View>
              </View>

              {paymentMethod === 'CARD' && (
                <View style={styles.cardDetailsBox}>
                  <TextInput
                    label="Card Number *"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    mode="outlined"
                    placeholder="1234 5678 9012 3456"
                    keyboardType="numeric"
                    maxLength={16}
                    style={styles.cardInput}
                  />
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                    <TextInput
                      label="Expiry (MM/YY) *"
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                      mode="outlined"
                      placeholder="12/28"
                      maxLength={5}
                      style={[styles.cardInput, { flex: 1 }]}
                    />
                    <TextInput
                      label="CVV *"
                      value={cardCvv}
                      onChangeText={setCardCvv}
                      mode="outlined"
                      placeholder="123"
                      keyboardType="numeric"
                      secureTextEntry
                      maxLength={3}
                      style={[styles.cardInput, { flex: 1 }]}
                    />
                  </View>
                  <View style={styles.sslBadge}>
                    <Icon name="lock" size={14} color="#059669" />
                    <Text style={styles.sslText}>256-bit Encrypted SSL Secure Payment</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>

            {/* Net Banking Option */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.methodOption,
                paymentMethod === 'NETBANKING' && { borderColor: theme.colors.primary, backgroundColor: '#f0f9ff', borderWidth: 2 },
              ]}
              onPress={() => setPaymentMethod('NETBANKING')}
            >
              <View style={styles.methodHeader}>
                <RadioButton
                  value="NETBANKING"
                  status={paymentMethod === 'NETBANKING' ? 'checked' : 'unchecked'}
                  onPress={() => setPaymentMethod('NETBANKING')}
                  color={theme.colors.primary}
                />
                <Icon name="bank-outline" size={22} color="#0891b2" />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text variant="titleSmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                    Net Banking
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    All Major Indian Banks Supported
                  </Text>
                </View>
              </View>

              {paymentMethod === 'NETBANKING' && (
                <View style={styles.bankGrid}>
                  {popularBanks.map((b) => (
                    <TouchableOpacity
                      key={b.id}
                      activeOpacity={0.8}
                      style={[
                        styles.bankChip,
                        selectedBank === b.id && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
                      ]}
                      onPress={() => setSelectedBank(b.id)}
                    >
                      <Text style={[styles.bankText, selectedBank === b.id && { color: '#ffffff' }]}>{b.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </TouchableOpacity>

            {/* Cash on Delivery (COD) Option */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.methodOption,
                paymentMethod === 'COD' && { borderColor: theme.colors.primary, backgroundColor: '#f0f9ff', borderWidth: 2 },
              ]}
              onPress={() => setPaymentMethod('COD')}
            >
              <View style={styles.methodHeader}>
                <RadioButton
                  value="COD"
                  status={paymentMethod === 'COD' ? 'checked' : 'unchecked'}
                  onPress={() => setPaymentMethod('COD')}
                  color={theme.colors.primary}
                />
                <Icon name="cash" size={22} color="#059669" />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text variant="titleSmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                    Cash on Delivery (COD)
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    Pay cash or QR to delivery agent upon arrival
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Order Summary */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: '800', color: theme.colors.onSurface, marginBottom: 8 }}>
              Final Amount Breakdown
            </Text>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Subtotal</Text>
              <Text variant="bodySmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                {CURRENCY_SYMBOL}
                {subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Delivery Charge</Text>
              <Text variant="bodySmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                {CURRENCY_SYMBOL}
                {deliveryCharge.toFixed(2)}
              </Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text variant="bodySmall" style={{ color: '#059669', fontWeight: '700' }}>Discount</Text>
                <Text variant="bodySmall" style={{ color: '#059669', fontWeight: '700' }}>
                  - {CURRENCY_SYMBOL}
                  {discount.toFixed(2)}
                </Text>
              </View>
            )}
            <Divider style={{ marginVertical: 8 }} />
            <View style={styles.summaryRow}>
              <Text variant="titleMedium" style={{ fontWeight: '800', color: theme.colors.onSurface }}>
                Total Payable
              </Text>
              <Text variant="titleMedium" style={{ fontWeight: '800', color: theme.colors.primary }}>
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
          style={[styles.placeOrderBtn, { backgroundColor: theme.colors.primary }]}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: '800', fontSize: 15 }}
          icon="shield-check"
        >
          CONFIRM ORDER ({CURRENCY_SYMBOL}
          {grandTotal.toFixed(2)})
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 14,
    borderRadius: 18,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginVertical: 4,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  methodOption: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 10,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upiDetailsBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  qrBox: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  qrImage: {
    width: 220,
    height: 280,
    borderRadius: 8,
  },
  bankNameText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e3a8a',
    marginTop: 6,
  },
  upiIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 6,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 3,
  },
  copyBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  upiAppsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  upiAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  upiAppBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardDetailsBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },
  cardInput: {
    backgroundColor: '#ffffff',
  },
  sslBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  sslText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  bankChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  bankText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
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
    borderRadius: 18,
  },
});
