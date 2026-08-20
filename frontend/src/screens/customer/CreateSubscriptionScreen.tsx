import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Button, useTheme, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { GradientHeader } from '../../components/common/GradientHeader';
import { subscriptionApi } from '../../api/subscriptionApi';
import { addressApi } from '../../api/addressApi';
import { Address, Product } from '../../types';

export const CreateSubscriptionScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const products = useSelector((state: RootState) => state.products.products);

  const getTodayFormatted = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayFormatted();

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [frequency, setFrequency] = useState<'DAILY' | 'ALTERNATE_DAYS' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [deliveryTime, setDeliveryTime] = useState<string>('08:00 AM - 10:00 AM');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(true);

  useEffect(() => {
    setStartDate(getTodayFormatted());
  }, []);

  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [products]);

  const loadAddresses = async () => {
    try {
      const res = await addressApi.getAddresses();
      if (res.data && res.data.addresses) {
        setAddresses(res.data.addresses);
        if (res.data.addresses.length > 0 && !selectedAddressId) {
          const defaultAddr = res.data.addresses.find((a: Address) => a.isDefault) || res.data.addresses[0];
          setSelectedAddressId(defaultAddr.id);
        }
      }
    } catch (err) {
      console.log('Error loading addresses for subscription:', err);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handleCreate = async () => {
    setErrorMessage(null);

    if (!selectedProductId) {
      const msg = 'Please select a water product for subscription.';
      setErrorMessage(msg);
      Alert.alert('Error', msg);
      return;
    }

    if (!selectedAddressId) {
      const msg = 'Please select or add a delivery address first.';
      setErrorMessage(msg);
      Alert.alert('Address Required', msg, [
        { text: 'Add Address', onPress: () => navigation.navigate('AddEditAddress') },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    setLoading(true);
    try {
      await subscriptionApi.createSubscription({
        productId: selectedProductId,
        quantity: Math.max(1, quantity),
        frequency,
        startDate,
        deliveryTime,
        addressId: selectedAddressId,
      });

      Alert.alert('Subscription Activated! 🎉', `Your recurring water delivery schedule starting on ${startDate} is active.`, [
        {
          text: 'View Subscriptions',
          onPress: () => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('SubscriptionsTab');
            }
          },
        },
      ]);

      // Fallback auto back
      setTimeout(() => {
        if (navigation.canGoBack()) navigation.goBack();
      }, 600);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error creating subscription.';
      setErrorMessage(msg);
      Alert.alert('Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const frequencies = [
    { id: 'DAILY', title: 'Everyday', desc: 'Daily delivery' },
    { id: 'ALTERNATE_DAYS', title: 'Alternate Days', desc: 'Every 2 days' },
    { id: 'WEEKLY', title: 'Weekly', desc: 'Once a week' },
    { id: 'MONTHLY', title: 'Monthly', desc: 'Once a month' },
  ];

  const timeSlots = [
    '07:00 AM - 09:00 AM',
    '09:00 AM - 11:00 AM',
    '04:00 PM - 06:00 PM',
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GradientHeader title="Create Water Subscription" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        )}

        {/* 1. SELECT PRODUCT */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          1. Select Water Product
        </Text>
        <View style={styles.productGrid}>
          {products.map((p) => {
            const isSelected = selectedProductId === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.8}
                style={[
                  styles.productCard,
                  { backgroundColor: theme.colors.surface },
                  isSelected && { borderColor: theme.colors.primary, borderWidth: 2, backgroundColor: '#f0f9ff' },
                ]}
                onPress={() => setSelectedProductId(p.id)}
              >
                <View style={styles.productRow}>
                  <Text style={{ fontSize: 28, marginRight: 10 }}>{p.unit === 'TANKER' ? '🚛' : '🚰'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text variant="titleSmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                      {p.name}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      {p.capacity || 'Standard'} • ₹{p.price} / delivery
                    </Text>
                  </View>
                  {isSelected && <Icon name="check-circle" size={22} color={theme.colors.primary} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 2. QUANTITY STEPPER */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground, marginTop: 18 }]}>
          2. Quantity per Delivery
        </Text>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.quantityRow}>
            <View>
              <Text variant="titleSmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                {selectedProduct ? `${selectedProduct.name} Quantity` : 'Water Quantity'}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                Delivered on every schedule run
              </Text>
            </View>
            <View style={styles.stepper}>
              <IconButton
                icon="minus"
                size={20}
                mode="contained"
                containerColor="#e0f2fe"
                iconColor="#0284c7"
                disabled={quantity <= 1}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              />
              <Text style={styles.quantityCount}>{quantity}</Text>
              <IconButton
                icon="plus"
                size={20}
                mode="contained"
                containerColor="#0284c7"
                iconColor="#ffffff"
                onPress={() => setQuantity((q) => q + 1)}
              />
            </View>
          </Card.Content>
        </Card>

        {/* 3. INTERACTIVE CALENDAR FOR START DATE */}
        <View style={styles.sectionHeaderRow}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            3. Subscription Start Date 📅
          </Text>
          <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
            <Text style={{ color: theme.colors.primary, fontWeight: '700', fontSize: 13 }}>
              {startDate} ({showCalendar ? 'Hide' : 'Change'})
            </Text>
          </TouchableOpacity>
        </View>

        {showCalendar && (
          <Card style={[styles.calendarCard, { backgroundColor: theme.colors.surface }]}>
            <Calendar
              key={startDate || todayStr}
              initialDate={startDate || todayStr}
              current={startDate || todayStr}
              minDate={todayStr}
              onDayPress={(day: any) => {
                setStartDate(day.dateString);
              }}
              markedDates={{
                [startDate]: { selected: true, selectedColor: theme.colors.primary, selectedTextColor: '#ffffff' },
              }}
              theme={{
                calendarBackground: 'transparent',
                textSectionTitleColor: theme.colors.onSurfaceVariant,
                selectedDayBackgroundColor: theme.colors.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: theme.colors.primary,
                dayTextColor: theme.colors.onSurface,
                arrowColor: theme.colors.primary,
                monthTextColor: theme.colors.onSurface,
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
              }}
            />
          </Card>
        )}

        {/* 4. FREQUENCY */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground, marginTop: 18 }]}>
          4. Delivery Schedule Frequency
        </Text>
        <View style={styles.freqGrid}>
          {frequencies.map((f) => {
            const isSelected = frequency === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                activeOpacity={0.8}
                style={[
                  styles.freqChip,
                  { backgroundColor: theme.colors.surface },
                  isSelected && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
                ]}
                onPress={() => setFrequency(f.id as any)}
              >
                <Text style={[styles.freqTitle, isSelected && { color: '#ffffff' }]}>{f.title}</Text>
                <Text style={[styles.freqDesc, isSelected && { color: '#e0f2fe' }]}>{f.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 5. TIME SLOT */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground, marginTop: 18 }]}>
          5. Preferred Delivery Time Slot
        </Text>
        <View style={styles.slotRow}>
          {timeSlots.map((slot) => {
            const isSelected = deliveryTime === slot;
            return (
              <TouchableOpacity
                key={slot}
                activeOpacity={0.8}
                style={[
                  styles.slotChip,
                  { backgroundColor: theme.colors.surface },
                  isSelected && { backgroundColor: '#0284c7', borderColor: '#0284c7' },
                ]}
                onPress={() => setDeliveryTime(slot)}
              >
                <Icon name="clock-outline" size={14} color={isSelected ? '#ffffff' : theme.colors.primary} />
                <Text style={[styles.slotText, isSelected && { color: '#ffffff' }]}>{slot}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 6. DELIVERY ADDRESS */}
        <View style={styles.sectionHeaderRow}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            6. Delivery Address
          </Text>
          <Button compact mode="text" onPress={() => navigation.navigate('AddEditAddress')}>
            + Add New
          </Button>
        </View>

        {addresses.length === 0 ? (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.noAddrBox}>
              <Text variant="bodyMedium" style={{ color: theme.colors.outline, marginBottom: 8 }}>
                No saved delivery addresses found.
              </Text>
              <Button mode="contained" compact style={{ borderRadius: 12 }} onPress={() => navigation.navigate('AddEditAddress')}>
                Add Delivery Address
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <View style={styles.addrList}>
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <TouchableOpacity
                  key={addr.id}
                  activeOpacity={0.8}
                  style={[
                    styles.addrCard,
                    { backgroundColor: theme.colors.surface },
                    isSelected && { borderColor: theme.colors.primary, borderWidth: 2, backgroundColor: '#f0f9ff' },
                  ]}
                  onPress={() => setSelectedAddressId(addr.id)}
                >
                  <View style={styles.addrRow}>
                    <Icon
                      name={addr.type === 'OFFICE' ? 'office-building' : 'home'}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text variant="titleSmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                        {addr.fullName} ({addr.type})
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {addr.houseBuilding}, {addr.area}, {addr.city} - {addr.pincode}
                      </Text>
                    </View>
                    {isSelected && <Icon name="check-circle" size={20} color={theme.colors.primary} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* 7. SUMMARY & ACTIVATE */}
        <Card style={[styles.summaryCard, { backgroundColor: '#f0f9ff' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: '800', color: '#0f172a', marginBottom: 6 }}>
              Subscription Summary
            </Text>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={{ color: '#475569' }}>Product:</Text>
              <Text variant="bodySmall" style={{ fontWeight: '700', color: '#0f172a' }}>
                {selectedProduct?.name || 'Water Can'} × {quantity}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={{ color: '#475569' }}>Start Date:</Text>
              <Text variant="bodySmall" style={{ fontWeight: '700', color: '#0284c7' }}>
                📅 {startDate}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={{ color: '#475569' }}>Schedule:</Text>
              <Text variant="bodySmall" style={{ fontWeight: '700', color: '#0369a1' }}>
                {frequency} • {deliveryTime}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={{ color: '#475569' }}>Cost per delivery:</Text>
              <Text variant="titleSmall" style={{ fontWeight: '800', color: '#0284c7' }}>
                ₹{(selectedProduct?.price || 30) * quantity}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleCreate}
          loading={loading}
          disabled={loading}
          style={[styles.submitBtn, { backgroundColor: theme.colors.primary }]}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: '800', fontSize: 15 }}
          icon="calendar-check"
        >
          ACTIVATE WATER SUBSCRIPTION
        </Button>
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
  errorBanner: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  errorText: {
    color: '#991b1b',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  productGrid: {
    gap: 10,
  },
  productCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  calendarCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 6,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quantityCount: {
    fontSize: 18,
    fontWeight: '800',
    minWidth: 24,
    textAlign: 'center',
  },
  freqGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  freqChip: {
    width: '48%',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  freqTitle: {
    fontWeight: '700',
    fontSize: 13,
  },
  freqDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  slotRow: {
    gap: 8,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  slotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noAddrBox: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  addrList: {
    gap: 8,
    marginTop: 6,
  },
  addrCard: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addrRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryCard: {
    borderRadius: 16,
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  submitBtn: {
    borderRadius: 18,
    marginTop: 18,
  },
});
