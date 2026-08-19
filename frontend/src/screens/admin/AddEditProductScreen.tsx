import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, RadioButton } from 'react-native-paper';
import { productApi } from '../../api/productApi';
import { GradientHeader } from '../../components/common/GradientHeader';

export const AddEditProductScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('20L');
  const [price, setPrice] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState('10');
  const [unit, setUnit] = useState<'CAN' | 'TANKER'>('CAN');
  const [stock, setStock] = useState('500');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !price || !capacity) {
      Alert.alert('Validation Error', 'Product Name, Price, and Capacity are required.');
      return;
    }
    setLoading(true);
    try {
      await productApi.createProduct({
        name,
        description,
        capacity,
        price,
        deliveryCharge,
        unit,
        stock,
        isAvailable: true,
      });

      Alert.alert('Success', 'New product added successfully');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Add Water Product" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Product Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Capacity (e.g. 20L, 1000L)"
          value={capacity}
          onChangeText={setCapacity}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Price (₹)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Delivery Charge (₹)"
          value={deliveryCharge}
          onChangeText={setDeliveryCharge}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Initial Stock Quantity"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <Text style={{ fontWeight: 'bold', marginVertical: 8 }}>Unit Type:</Text>
        <View style={styles.radioRow}>
          <TouchableOpacity style={styles.radioItem} onPress={() => setUnit('CAN')}>
            <RadioButton value="CAN" status={unit === 'CAN' ? 'checked' : 'unchecked'} />
            <Text>Dispenser Can</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.radioItem} onPress={() => setUnit('TANKER')}>
            <RadioButton value="TANKER" status={unit === 'TANKER' ? 'checked' : 'unchecked'} />
            <Text>Water Tanker</Text>
          </TouchableOpacity>
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={styles.saveBtn}
          contentStyle={{ paddingVertical: 6 }}
        >
          Save Product
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
  },
  input: {
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveBtn: {
    borderRadius: 25,
    marginTop: 10,
  },
});
