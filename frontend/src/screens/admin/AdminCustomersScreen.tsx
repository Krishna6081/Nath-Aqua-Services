import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { adminApi } from '../../api/adminApi';
import { GradientHeader } from '../../components/common/GradientHeader';

export const AdminCustomersScreen = ({ navigation }: any) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCustomers();
      setCustomers(res.data.customers);
    } catch (err) {
      console.log('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      await adminApi.toggleUserStatus(id);
      loadCustomers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Registered Customers" showBack onBackPress={() => navigation.goBack()} />

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={loadCustomers}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {item.name}
                </Text>
                <Text variant="bodySmall" style={{ color: '#64748b' }}>
                  📧 {item.email}
                </Text>
                <Text variant="bodySmall" style={{ color: '#0369a1' }}>
                  📞 {item.phone} • Orders: {item._count?.orders || 0}
                </Text>
              </View>
              <Button
                compact
                mode={item.isActive ? 'outlined' : 'contained'}
                buttonColor={item.isActive ? undefined : '#ef4444'}
                onPress={() => handleToggleStatus(item.id)}
              >
                {item.isActive ? 'Block' : 'Unblock'}
              </Button>
            </Card.Content>
          </Card>
        )}
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
  },
  card: {
    marginBottom: 10,
    borderRadius: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
