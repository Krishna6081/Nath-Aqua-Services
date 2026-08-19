import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Button, RadioButton, TextInput, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { GradientHeader } from '../../components/common/GradientHeader';
import { subscriptionApi } from '../../api/subscriptionApi';
import { addressApi } from '../../api/addressApi';
import { Address, Product } from '../../types';

export const CreateSubscriptionScreen = ({ navigation }: any) => {
  const products = useSelector((state: RootState) => state.products.products);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [frequency, setFrequency] = useState<'DAILY' | 'ALTERNATE_DAYS' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [deliveryTime, setDeliveryTime] = useState<string>('08:00 AM - 10:00 AM');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (products.length > 0) setSelectedProductId(products[0].id);

    const loadAddresses = async () => {
      try {
        const res = await addressApi.getAddresses();
        setAddresses(res.data.addresses);
        if (res.data.addresses.length > 0) setSelectedAddressId(res.data.addresses[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    loadAddresses();
  }, [products]);

  const handleCreate = async () => {
    if (!selectedProductId || !selectedAddressId) {
      Alert.alert('Error', 'Please select product and delivery address.');
      return;
    }
    setLoading(true);
    try {
      await subscriptionApi.createSubscription({
        productId: selectedProductId,
        quantity: parseInt(quantity) || 1,
        frequency,
        startDate,
        deliveryTime,
        addressId: selectedAddressId,
      });

      Alert.alert('Subscription Active 🎉', 'Recurring water delivery schedule created!');
      navigation.replace('Subscriptions');
    } catch (err: any) {
      Alert.alert('Failed', err.message || 'Error creating subscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Create Water Subscription" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Product Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 10 }}>
              1. Select Water Product
            </Text>
            {products.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.row, selectedProductId === p.id && styles.selectedRow]}
                onPress={() => setSelectedProductId(p.id)}
              >
                <RadioButton
                  value={p.id}
                  status={selectedProductId === p.id ? 'checked' : 'unchecked'}
                  onPress={() => setSelectedProductId(p.id)}
                />
                <Text style={{ fontWeight: 'bold', flex: 1 }}>
                  {p.name} (₹{p.price})
                </Text>
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>

        {/* Frequency & Quantity */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 10 }}>
              2. Delivery Frequency & Quantity
            </Text>
            <TextInput
              label="Quantity per delivery"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <Text variant="bodySmall" style={{ color: '#64748b', marginBottom: 6 }}>
              Select Schedule:
            </Text>
            {[
              { key: 'DAILY', label: 'Everyday (Daily Delivery)' },
              { key: 'ALTERNATE_DAYS', label: 'Alternate Days (Every 2 days)' },
              { key: 'WEEKLY', label: 'Weekly (Once a week)' },
              { key: 'MONTHLY', label: 'Monthly (Once a month)' },
            ].map((freq) => (
              <TouchableOpacity
                key={freq.key}
                style={styles.row}
                onPress={() => setFrequency(freq.key as any)}
              >
                <RadioButton
                  value={freq.key}
                  status={frequency === freq.key ? 'checked' : 'unchecked'}
                  onPress={() => setFrequency(freq.key as any)}
                />
                <Text>{freq.label}</Text>
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleCreate}
          loading={loading}
          disabled={loading}
          style={styles.submitBtn}
          contentStyle={{ paddingVertical: 8 }}
        >
          Activate Water Subscription
        </Button>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  selectedRow: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
  },
  submitBtn: {
    borderRadius: 25,
    marginTop: 10,
  },
});
