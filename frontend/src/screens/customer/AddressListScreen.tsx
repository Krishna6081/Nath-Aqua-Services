import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Text, Button, FAB, useTheme } from 'react-native-paper';
import { addressApi } from '../../api/addressApi';
import { Address } from '../../types';
import { GradientHeader } from '../../components/common/GradientHeader';

export const AddressListScreen = ({ navigation }: any) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const res = await addressApi.getAddresses();
      setAddresses(res.data.addresses);
    } catch (err) {
      console.log('Error loading addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await addressApi.deleteAddress(id);
      loadAddresses();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="My Saved Addresses" showBack onBackPress={() => navigation.goBack()} />

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={loadAddresses}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.row}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {item.fullName} ({item.type})
                </Text>
                {item.isDefault && <Text style={styles.defaultBadge}>DEFAULT</Text>}
              </View>
              <Text variant="bodySmall" style={{ color: '#475569', marginVertical: 4 }}>
                {item.houseBuilding}, {item.street}, {item.area}, {item.city} - {item.pincode}
              </Text>
              <Text variant="bodySmall" style={{ color: '#64748b' }}>
                Phone: {item.phone}
              </Text>
              <View style={styles.actions}>
                <Button compact mode="text" onPress={() => handleDelete(item.id)}>
                  Delete Address
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}
      />

      <FAB
        icon="plus"
        label="Add New Address"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#ffffff"
        onPress={() => navigation.navigate('AddEditAddress')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    borderRadius: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  defaultBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 10,
    borderRadius: 25,
  },
});
