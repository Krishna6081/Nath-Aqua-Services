import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, FAB, useTheme } from 'react-native-paper';
import { subscriptionApi } from '../../api/subscriptionApi';
import { Subscription } from '../../types';
import { GradientHeader } from '../../components/common/GradientHeader';
import { StatusBadge } from '../../components/common/StatusBadge';

export const SubscriptionsScreen = ({ navigation }: any) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await subscriptionApi.getSubscriptions();
      setSubscriptions(res.data.subscriptions);
    } catch (err) {
      console.log('Error loading subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  return (
    <View style={styles.container}>
      <GradientHeader title="Water Subscriptions" subtitle="Manage your recurring delivery schedule" />

      {subscriptions.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text variant="titleMedium" style={styles.emptyText}>
            No active water subscriptions found.
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('CreateSubscription')}
            style={styles.createBtn}
          >
            + Create Subscription
          </Button>
        </View>
      ) : (
        <FlatList
          data={subscriptions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={loadSubscriptions}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                    {item.product?.name || 'Water Can Subscription'}
                  </Text>
                  <StatusBadge status={item.status} />
                </View>
                <Text variant="bodySmall" style={{ color: '#64748b', marginVertical: 4 }}>
                  Frequency: {item.frequency} • Quantity: {item.quantity}
                </Text>
                <Text variant="bodySmall" style={{ color: '#0369a1', fontWeight: 'bold' }}>
                  Next Scheduled Delivery: {item.nextDeliveryDate} ({item.deliveryTime})
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      )}

      <FAB
        icon="plus"
        label="New Subscription"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#ffffff"
        onPress={() => navigation.navigate('CreateSubscription')}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 16,
  },
  createBtn: {
    borderRadius: 25,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 10,
    borderRadius: 25,
  },
});
