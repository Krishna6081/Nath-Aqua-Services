import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Alert } from 'react-native';
import { Text, Card, Button, TextInput, IconButton, Divider, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { GradientHeader } from '../../components/common/GradientHeader';
import { updateQuantity, removeFromCart, applyCoupon, removeCoupon } from '../../redux/slices/cartSlice';
import { CURRENCY_SYMBOL } from '../../constants/config';
import { couponApi } from '../../api/couponApi';

export const CartScreen = ({ navigation }: any) => {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { items, appliedCoupon } = useSelector((state: RootState) => state.cart);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const deliveryCharge = items.reduce((sum, i) => sum + i.product.deliveryCharge, 0);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - discount);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput) return;
    setCouponLoading(true);
    try {
      const response = await couponApi.validateCoupon({
        code: couponCodeInput,
        amount: subtotal,
      });
      dispatch(applyCoupon(response.data.coupon));
      Alert.alert('Coupon Applied', response.data.message);
    } catch (err: any) {
      Alert.alert('Coupon Error', err.message || 'Invalid coupon code.');
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <GradientHeader title="Your Water Cart" showBack onBackPress={() => navigation.goBack()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text variant="titleMedium" style={styles.emptyText}>
            Your cart is currently empty.
          </Text>
          <Button mode="contained" onPress={() => navigation.navigate('WaterServices')} style={styles.browseBtn}>
            Browse Water Services
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientHeader title="Your Water Cart" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Cart Items List */}
        {items.map(({ product, quantity }) => (
          <Card key={product.id} style={styles.itemCard}>
            <Card.Content style={styles.itemRow}>
              <Text style={styles.itemIcon}>{product.unit === 'CAN' ? '🚰' : '🚚'}</Text>
              <View style={styles.itemDetails}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {product.name}
                </Text>
                <Text variant="bodySmall" style={{ color: '#64748b' }}>
                  {CURRENCY_SYMBOL}
                  {product.price} x {quantity} = {CURRENCY_SYMBOL}
                  {(product.price * quantity).toFixed(2)}
                </Text>
              </View>
              <View style={styles.counter}>
                <IconButton
                  icon="minus"
                  size={18}
                  onPress={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity - 1 }))}
                />
                <Text style={{ fontWeight: 'bold' }}>{quantity}</Text>
                <IconButton
                  icon="plus"
                  size={18}
                  onPress={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity + 1 }))}
                />
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Coupon Input */}
        <Card style={styles.couponCard}>
          <Card.Content>
            <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 8 }}>
              Apply Coupon Code
            </Text>
            {appliedCoupon ? (
              <View style={styles.appliedCouponRow}>
                <Text style={{ color: '#15803d', fontWeight: 'bold' }}>
                  ✓ Code {appliedCoupon.code} Applied ({CURRENCY_SYMBOL}
                  {appliedCoupon.discountAmount} OFF)
                </Text>
                <IconButton icon="close" size={18} onPress={() => dispatch(removeCoupon())} />
              </View>
            ) : (
              <View style={styles.couponInputRow}>
                <TextInput
                  placeholder="Enter WELCOME10 or WATER50"
                  value={couponCodeInput}
                  onChangeText={setCouponCodeInput}
                  mode="outlined"
                  dense
                  style={{ flex: 1 }}
                />
                <Button mode="contained" onPress={handleApplyCoupon} loading={couponLoading} style={{ marginLeft: 8 }}>
                  Apply
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Bill Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 12 }}>
              Bill Breakdown
            </Text>
            <View style={styles.summaryRow}>
              <Text>Subtotal</Text>
              <Text>
                {CURRENCY_SYMBOL}
                {subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Delivery Charges</Text>
              <Text>
                {CURRENCY_SYMBOL}
                {deliveryCharge.toFixed(2)}
              </Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={{ color: '#15803d' }}>Coupon Discount</Text>
                <Text style={{ color: '#15803d' }}>
                  - {CURRENCY_SYMBOL}
                  {discount.toFixed(2)}
                </Text>
              </View>
            )}
            <Divider style={{ marginVertical: 10 }} />
            <View style={styles.summaryRow}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                Grand Total
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
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutBtn}
          contentStyle={{ paddingVertical: 8 }}
        >
          Proceed to Checkout ({CURRENCY_SYMBOL}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 16,
  },
  emptyText: {
    color: '#64748b',
    marginBottom: 20,
  },
  browseBtn: {
    borderRadius: 25,
  },
  itemCard: {
    marginBottom: 10,
    borderRadius: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponCard: {
    marginVertical: 12,
    borderRadius: 14,
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appliedCouponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryCard: {
    borderRadius: 14,
    marginBottom: 20,
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
  checkoutBtn: {
    borderRadius: 25,
  },
});
