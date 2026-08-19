import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { adminApi } from '../../api/adminApi';
import { GradientHeader } from '../../components/common/GradientHeader';
import { CURRENCY_SYMBOL } from '../../constants/config';

export const AdminDashboardScreen = ({ navigation }: any) => {
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const loadStats = async () => {
    try {
      const res = await adminApi.getDashboardStats();
      setStats(res.data.stats);
    } catch (err) {
      console.log('Error loading admin stats:', err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Admin Control Center" subtitle="Nath Water Service Management" />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Revenue Cards */}
        <View style={styles.row}>
          <Card style={[styles.card, { backgroundColor: '#0284c7' }]}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text variant="headlineSmall" style={{ color: '#ffffff', fontWeight: 'bold' }}>
                {CURRENCY_SYMBOL}
                {stats?.todayRevenue || 0}
              </Text>
              <Text variant="bodySmall" style={{ color: '#e0f2fe' }}>
                Today's Revenue
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.card, { backgroundColor: '#0369a1' }]}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text variant="headlineSmall" style={{ color: '#ffffff', fontWeight: 'bold' }}>
                {CURRENCY_SYMBOL}
                {stats?.totalRevenue || 0}
              </Text>
              <Text variant="bodySmall" style={{ color: '#e0f2fe' }}>
                Total Revenue
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Order Counters */}
        <View style={styles.row}>
          <Card style={styles.card}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: '#b45309' }}>
                {stats?.pendingOrders || 0}
              </Text>
              <Text variant="bodySmall">Pending Orders</Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: '#15803d' }}>
                {stats?.deliveredOrders || 0}
              </Text>
              <Text variant="bodySmall">Delivered</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Management Quick Links */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Management Controls
        </Text>

        <View style={styles.grid}>
          <Card style={styles.gridCard} onPress={() => navigation.navigate('AdminProducts')}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 32 }}>🚰</Text>
              <Text style={styles.gridLabel}>Water Products</Text>
            </Card.Content>
          </Card>

          <Card style={styles.gridCard} onPress={() => navigation.navigate('AdminOrders')}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 32 }}>📋</Text>
              <Text style={styles.gridLabel}>All Orders</Text>
            </Card.Content>
          </Card>

          <Card style={styles.gridCard} onPress={() => navigation.navigate('AdminCustomers')}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 32 }}>👥</Text>
              <Text style={styles.gridLabel}>Customers</Text>
            </Card.Content>
          </Card>

          <Card style={styles.gridCard} onPress={() => navigation.navigate('AdminReports')}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 32 }}>📊</Text>
              <Text style={styles.gridLabel}>Analytics & Reports</Text>
            </Card.Content>
          </Card>
        </View>
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
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#0f172a',
    marginVertical: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    borderRadius: 16,
    paddingVertical: 8,
  },
  gridLabel: {
    fontWeight: 'bold',
    marginTop: 6,
    color: '#1e293b',
  },
});
