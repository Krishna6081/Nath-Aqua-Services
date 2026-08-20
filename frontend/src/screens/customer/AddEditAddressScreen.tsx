import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, RadioButton, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addressApi } from '../../api/addressApi';
import { GradientHeader } from '../../components/common/GradientHeader';

export const AddEditAddressScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [houseBuilding, setHouseBuilding] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [type, setType] = useState<'HOME' | 'OFFICE' | 'OTHER'>('HOME');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name || '');
      if (!phone) setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async () => {
    setErrorMessage(null);
    if (!fullName.trim() || !phone.trim() || !houseBuilding.trim() || !area.trim() || !pincode.trim()) {
      const msg = 'Please fill all required fields marked with *';
      setErrorMessage(msg);
      Alert.alert('Validation Error', msg);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        houseBuilding: houseBuilding.trim(),
        street: street.trim() || area.trim(),
        area: area.trim(),
        city: city.trim() || 'Pune',
        state: state.trim() || 'Maharashtra',
        pincode: pincode.trim(),
        landmark: landmark.trim(),
        type,
        isDefault: true,
      };

      await addressApi.createAddress(payload);

      Alert.alert('Success 🎉', 'Delivery address saved successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
      // Safety fallback goBack
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } catch (err: any) {
      const errorText = err.response?.data?.message || err.message || 'Error saving address. Please try again.';
      setErrorMessage(errorText);
      Alert.alert('Error', errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GradientHeader title="Add Delivery Address" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        )}

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
        <TextInput
          label="Landmark (Optional)"
          value={landmark}
          onChangeText={setLandmark}
          mode="outlined"
          style={styles.input}
        />

        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Address Type:</Text>
        <View style={styles.typeRow}>
          {[
            { id: 'HOME', label: 'Home', icon: 'home' },
            { id: 'OFFICE', label: 'Office', icon: 'office-building' },
            { id: 'OTHER', label: 'Other', icon: 'map-marker' },
          ].map((item) => {
            const isSelected = type === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                style={[
                  styles.typeChip,
                  isSelected
                    ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                    : { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
                ]}
                onPress={() => setType(item.id as any)}
              >
                <Text
                  style={[
                    styles.typeText,
                    { color: isSelected ? '#ffffff' : theme.colors.onSurface },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]}
          contentStyle={{ paddingVertical: 8 }}
          labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
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
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  errorText: {
    color: '#991b1b',
    fontWeight: '600',
    fontSize: 13,
  },
  input: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginVertical: 8,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeText: {
    fontWeight: '700',
    fontSize: 13,
  },
  saveBtn: {
    borderRadius: 25,
    marginTop: 8,
  },
});
