import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Text, Button, FAB, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
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
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.subscriptions || res.data?.data || [];
      setSubscriptions(list);
    } catch (err) {
      console.log('Error loading subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSubscriptions();
    }, [])
  );

  const handlePause = async (id: string) => {
    try {
      await subscriptionApi.pauseSubscription(id);
      loadSubscriptions();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not pause subscription');
    }
  };

  const handleResume = async (id: string) => {
    try {
      await subscriptionApi.resumeSubscription(id);
      loadSubscriptions();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not resume subscription');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel and delete this recurring water subscription?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await subscriptionApi.deleteSubscription(id);
              loadSubscriptions();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Could not delete subscription');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GradientHeader
        title="Water Subscriptions & Refills"
        subtitle="Manage your recurring water delivery schedule"
      />

      {subscriptions.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text variant="titleMedium" style={[styles.emptyTitle, { color: theme.colors.onBackground }]}>
            No active water subscriptions found
          </Text>
          <Text variant="bodySmall" style={styles.emptySubtext}>
            Set up an automated water refill schedule so you never run out of clean drinking water.
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('CreateSubscription')}
            style={[styles.createBtn, { backgroundColor: theme.colors.primary }]}
            contentStyle={{ paddingHorizontal: 16, height: 44 }}
            labelStyle={{ fontWeight: 'bold' }}
          >
            + Create Subscription Schedule
          </Button>
        </View>
      ) : (
        <FlatList
          data={subscriptions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={loadSubscriptions}
          renderItem={({ item }) => {
            const productName = item.product?.name || '20L Drinking Water Can';
            const addressText = item.address
              ? `${item.address.houseBuilding}, ${item.address.area}`
              : 'Default Saved Address';

            return (
              <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View style={styles.productTitleRow}>
                      <Text style={{ fontSize: 24, marginRight: 8 }}>🚰</Text>
                      <View>
                        <Text variant="titleMedium" style={{ fontWeight: '800', color: theme.colors.onSurface }}>
                          {productName}
                        </Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                          Quantity: {item.quantity} {item.quantity === 1 ? 'Can' : 'Cans'} per refill
                        </Text>
                      </View>
                    </View>
                    <StatusBadge status={item.status} />
                  </View>

                  <View style={styles.detailsBox}>
                    <View style={styles.detailRow}>
                      <Icon name="repeat" size={16} color={theme.colors.primary} />
                      <Text variant="bodySmall" style={styles.detailText}>
                        Schedule: <Text style={{ fontWeight: '700' }}>{item.frequency}</Text> • {item.deliveryTime}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Icon name="calendar-check" size={16} color="#059669" />
                      <Text variant="bodySmall" style={styles.detailText}>
                        Next Refill Date:{' '}
                        <Text style={{ fontWeight: '800', color: '#059669' }}>
                          📅 {item.nextDeliveryDate || item.startDate}
                        </Text>
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Icon name="map-marker-outline" size={16} color="#64748b" />
                      <Text variant="bodySmall" style={styles.detailText} numberOfLines={1}>
                        Deliver to: {addressText}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    {item.status === 'ACTIVE' ? (
                      <Button
                        compact
                        mode="outlined"
                        style={{ borderRadius: 10 }}
                        onPress={() => handlePause(item.id)}
                      >
                        Pause Delivery
                      </Button>
                    ) : (
                      <Button
                        compact
                        mode="contained"
                        style={{ borderRadius: 10, backgroundColor: theme.colors.primary }}
                        onPress={() => handleResume(item.id)}
                      >
                        Resume Delivery
                      </Button>
                    )}
                    <Button
                      compact
                      mode="text"
                      textColor={theme.colors.error}
                      onPress={() => handleDelete(item.id)}
                    >
                      Cancel
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            );
          }}
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
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  card: {
    marginBottom: 14,
    borderRadius: 18,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailsBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    color: '#334155',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  emptyTitle: {
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#64748b',
    marginBottom: 20,
    textAlign: 'center',
    maxWidth: '85%',
  },
  createBtn: {
    borderRadius: 25,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 12,
    borderRadius: 25,
  },
});
