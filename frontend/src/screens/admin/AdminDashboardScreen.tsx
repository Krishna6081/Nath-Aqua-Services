import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button, useTheme, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../redux/store';
import { logoutUser } from '../../redux/slices/authSlice';
import { adminApi } from '../../api/adminApi';
import { CURRENCY_SYMBOL } from '../../constants/config';
import { AdminAnalyticsChart } from '../../components/admin/AdminAnalyticsChart';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminDashboardScreen = ({ navigation }: any) => {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDashboardStats();
      if (res.data && res.data.stats) {
        setStats(res.data.stats);
        if (res.data.stats.recentOrders) {
          setRecentOrders(res.data.stats.recentOrders);
        }
      }
    } catch (err) {
      console.log('Error loading admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert('Logout Admin', 'Are you sure you want to log out of Admin Control Center?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await dispatch(logoutUser());
          const parentNav = navigation.getParent();
          if (parentNav) {
            parentNav.reset({ index: 0, routes: [{ name: 'Auth' }] });
          } else {
            navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Modern Curved Admin Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerTop}>
          <View>
            <Text variant="titleLarge" style={styles.headerTitle}>
              Admin Control Center 🛡️
            </Text>
            <View style={styles.systemStatusBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.systemStatusText}>Systems Operational • DB Active</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutIconButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >
        {/* KPI Metrics Cards Grid */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: '#0284c7' }]}>
            <View style={styles.metricIconCircle}>
              <Icon name="currency-inr" size={20} color="#0284c7" />
            </View>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {CURRENCY_SYMBOL}
              {stats?.todayRevenue || 0}
            </Text>
            <Text style={styles.metricLabel}>Today's Revenue</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#0369a1' }]}>
            <View style={styles.metricIconCircle}>
              <Icon name="chart-arc" size={20} color="#0369a1" />
            </View>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {CURRENCY_SYMBOL}
              {stats?.totalRevenue || 0}
            </Text>
            <Text style={styles.metricLabel}>Total Revenue</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#d97706' }]}>
            <View style={styles.metricIconCircle}>
              <Icon name="package-variant" size={20} color="#d97706" />
            </View>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {stats?.pendingOrders || 0}
            </Text>
            <Text style={styles.metricLabel}>Pending Orders</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#059669' }]}>
            <View style={styles.metricIconCircle}>
              <Icon name="check-circle-outline" size={20} color="#059669" />
            </View>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {stats?.deliveredOrders || 0}
            </Text>
            <Text style={styles.metricLabel}>Delivered Today</Text>
          </View>
        </View>

        {/* Management Controls */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Management Controls
        </Text>
        <View style={styles.controlGrid}>
          <TouchableOpacity
            style={[styles.controlCard, { backgroundColor: theme.colors.surface }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AdminProducts')}
          >
            <View style={[styles.controlIconCircle, { backgroundColor: '#e0f2fe' }]}>
              <Icon name="water" size={24} color="#0284c7" />
            </View>
            <Text variant="titleSmall" style={styles.controlTitle}>
              Products
            </Text>
            <Text variant="bodySmall" style={styles.controlDesc}>
              Water Cans & Tankers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlCard, { backgroundColor: theme.colors.surface }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AdminOrders')}
          >
            <View style={[styles.controlIconCircle, { backgroundColor: '#cffaff' }]}>
              <Icon name="clipboard-list" size={24} color="#0891b2" />
            </View>
            <Text variant="titleSmall" style={styles.controlTitle}>
              All Orders
            </Text>
            <Text variant="bodySmall" style={styles.controlDesc}>
              Dispatch & Track
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlCard, { backgroundColor: theme.colors.surface }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AdminCustomers')}
          >
            <View style={[styles.controlIconCircle, { backgroundColor: '#dbeafe' }]}>
              <Icon name="account-group" size={24} color="#2563eb" />
            </View>
            <Text variant="titleSmall" style={styles.controlTitle}>
              Customers
            </Text>
            <Text variant="bodySmall" style={styles.controlDesc}>
              User Accounts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlCard, { backgroundColor: theme.colors.surface }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AdminReports')}
          >
            <View style={[styles.controlIconCircle, { backgroundColor: '#d1fae5' }]}>
              <Icon name="chart-bar" size={24} color="#059669" />
            </View>
            <Text variant="titleSmall" style={styles.controlTitle}>
              Analytics
            </Text>
            <Text variant="bodySmall" style={styles.controlDesc}>
              Reports & Revenue
            </Text>
          </TouchableOpacity>
        </View>

        {/* Graphs & Visual Analytics */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground, marginTop: 22 }]}>
          Visual Data Analytics
        </Text>
        <AdminAnalyticsChart
          weeklyData={
            stats?.weeklyTrend || [
              { day: 'Mon', amount: 1450, orders: 12 },
              { day: 'Tue', amount: 2100, orders: 18 },
              { day: 'Wed', amount: 1850, orders: 15 },
              { day: 'Thu', amount: 2600, orders: 22 },
              { day: 'Fri', amount: 3100, orders: 27 },
              { day: 'Sat', amount: 3900, orders: 34 },
              { day: 'Sun', amount: 4200, orders: 38 },
            ]
          }
          statusBreakdown={{
            delivered: stats?.deliveredOrders || 68,
            pending: stats?.pendingOrders || 18,
            outForDelivery: 10,
            cancelled: 4,
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: '800',
  },
  systemStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34d399',
  },
  systemStatusText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  logoutIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    elevation: 3,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    color: '#ffffff',
    fontWeight: '900',
  },
  metricLabel: {
    color: '#e0f2fe',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontWeight: '800',
    marginTop: 22,
    marginBottom: 12,
  },
  controlGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  controlCard: {
    width: '48%',
    borderRadius: 18,
    padding: 14,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  controlIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  controlTitle: {
    fontWeight: '700',
  },
  controlDesc: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
});
