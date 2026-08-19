import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, RadioButton } from 'react-native-paper';
import { addressApi } from '../../api/addressApi';
import { GradientHeader } from '../../components/common/GradientHeader';

export const AddEditAddressScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [houseBuilding, setHouseBuilding] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [type, setType] = useState<'HOME' | 'OFFICE' | 'OTHER'>('HOME');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName || !phone || !houseBuilding || !area || !pincode) {
      Alert.alert('Validation Error', 'Please fill all required address fields.');
      return;
    }

    setLoading(true);
    try {
      await addressApi.createAddress({
        fullName,
        phone,
        houseBuilding,
        street,
        area,
        city,
        state,
        pincode,
        landmark,
        type,
        isDefault: true,
      });

      Alert.alert('Success', 'Delivery address saved successfully');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error saving address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Add Delivery Address" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Full Name *"
          value={fullName}
          onChangeText={setFullName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Contact Phone Number *"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="House / Building / Apartment *"
          value={houseBuilding}
          onChangeText={setHouseBuilding}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Street Name / Road"
          value={street}
          onChangeText={setStreet}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Area / Sector *"
          value={area}
          onChangeText={setArea}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="City *"
          value={city}
          onChangeText={setCity}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Pincode (6 digits) *"
          value={pincode}
          onChangeText={setPincode}
          keyboardType="numeric"
          maxLength={6}
          mode="outlined"
          style={styles.input}
        />

        <Text style={{ fontWeight: 'bold', marginVertical: 6 }}>Address Type:</Text>
        <View style={styles.radioRow}>
          {['HOME', 'OFFICE', 'OTHER'].map((t) => (
            <TouchableOpacity key={t} style={styles.radioItem} onPress={() => setType(t as any)}>
              <RadioButton value={t} status={type === t ? 'checked' : 'unchecked'} />
              <Text>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={styles.saveBtn}
          contentStyle={{ paddingVertical: 6 }}
        >
          Save Address
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
    marginBottom: 10,
  },
  radioRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveBtn: {
    borderRadius: 25,
  },
});
