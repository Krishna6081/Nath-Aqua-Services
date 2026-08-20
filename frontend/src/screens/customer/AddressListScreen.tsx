import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, FAB, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
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
      if (res.data && res.data.addresses) {
        setAddresses(res.data.addresses);
      }
    } catch (err) {
      console.log('Error loading addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [])
  );

  const handleDelete = async (id: string) => {
    try {
      await addressApi.deleteAddress(id);
      loadAddresses();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GradientHeader title="My Saved Addresses" showBack onBackPress={() => navigation.goBack()} />

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={loadAddresses}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 44, marginBottom: 12 }}>📍</Text>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onBackground }}>
                No Saved Addresses
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline, textAlign: 'center', marginTop: 4 }}>
                Add your delivery address to quickly place water orders.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.row}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                  {item.fullName} ({item.type})
                </Text>
                {item.isDefault && <Text style={styles.defaultBadge}>DEFAULT</Text>}
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginVertical: 4 }}>
                {item.houseBuilding}, {item.street ? `${item.street}, ` : ''}{item.area}, {item.city} - {item.pincode}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                Phone: {item.phone}
              </Text>
              <View style={styles.actions}>
                <Button compact mode="text" textColor={theme.colors.error} onPress={() => handleDelete(item.id)}>
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
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 12,
    borderRadius: 14,
    elevation: 2,
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
    bottom: 12,
    borderRadius: 25,
  },
});
