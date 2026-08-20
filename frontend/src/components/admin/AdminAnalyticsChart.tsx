import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface WeeklyData {
  day: string;
  amount: number;
  orders: number;
}

interface AdminAnalyticsChartProps {
  weeklyData?: WeeklyData[];
  statusBreakdown?: {
    delivered: number;
    pending: number;
    outForDelivery: number;
    cancelled: number;
  };
  productBreakdown?: {
    cans20l: number;
    cans25l: number;
    tankers: number;
  };
}

export const AdminAnalyticsChart: React.FC<AdminAnalyticsChartProps> = ({
  weeklyData = [
    { day: 'Mon', amount: 1450, orders: 12 },
    { day: 'Tue', amount: 2100, orders: 18 },
    { day: 'Wed', amount: 1850, orders: 15 },
    { day: 'Thu', amount: 2600, orders: 22 },
    { day: 'Fri', amount: 3100, orders: 27 },
    { day: 'Sat', amount: 3900, orders: 34 },
    { day: 'Sun', amount: 4200, orders: 38 },
  ],
  statusBreakdown = {
    delivered: 68,
    pending: 18,
    outForDelivery: 10,
    cancelled: 4,
  },
  productBreakdown = {
    cans20l: 62,
    cans25l: 26,
    tankers: 12,
  },
}) => {
  const theme = useTheme();

  const maxAmount = Math.max(...weeklyData.map((d) => d.amount), 5000);
  const totalOrdersCount =
    statusBreakdown.delivered +
    statusBreakdown.pending +
    statusBreakdown.outForDelivery +
    statusBreakdown.cancelled;

  const deliveredPct = totalOrdersCount > 0 ? Math.round((statusBreakdown.delivered / totalOrdersCount) * 100) : 0;
  const pendingPct = totalOrdersCount > 0 ? Math.round((statusBreakdown.pending / totalOrdersCount) * 100) : 0;
  const outPct = totalOrdersCount > 0 ? Math.round((statusBreakdown.outForDelivery / totalOrdersCount) * 100) : 0;
  const cancelPct = totalOrdersCount > 0 ? Math.round((statusBreakdown.cancelled / totalOrdersCount) * 100) : 0;

  return (
    <View style={styles.container}>
      {/* 1. REVENUE TREND BAR CHART */}
      <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View>
              <Text variant="titleMedium" style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
                Weekly Revenue Trend 📈
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                7-day sales comparison
              </Text>
            </View>
            <View style={styles.growthBadge}>
              <Icon name="trending-up" size={14} color="#059669" />
              <Text style={styles.growthText}>+16.4%</Text>
            </View>
          </View>

          {/* Bar Visualizer */}
          <View style={styles.barsContainer}>
            {weeklyData.map((item, index) => {
              const heightPct = Math.max(12, Math.round((item.amount / maxAmount) * 100));
              const isHighest = item.amount === Math.max(...weeklyData.map((d) => d.amount));

              return (
                <View key={item.day} style={styles.barColumn}>
                  <Text style={styles.barValueText}>₹{item.amount > 999 ? `${(item.amount / 1000).toFixed(1)}k` : item.amount}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${heightPct}%` },
                        isHighest ? { backgroundColor: '#0284c7' } : { backgroundColor: '#38bdf8' },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDayLabel, isHighest && { fontWeight: 'bold', color: theme.colors.primary }]}>
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card.Content>
      </Card>

      {/* 2. ORDER STATUS DISTRIBUTION */}
      <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
            Order Status Breakdown 📊
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 14 }}>
            Fulfillment performance metrics
          </Text>

          {/* Multi-Segment Progress Bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.segment, { width: `${deliveredPct}%`, backgroundColor: '#10b981' }]} />
            <View style={[styles.segment, { width: `${pendingPct}%`, backgroundColor: '#f59e0b' }]} />
            <View style={[styles.segment, { width: `${outPct}%`, backgroundColor: '#0284c7' }]} />
            <View style={[styles.segment, { width: `${cancelPct}%`, backgroundColor: '#ef4444' }]} />
          </View>

          {/* Legend Grid */}
          <View style={styles.legendGrid}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
              <Text variant="bodySmall" style={styles.legendText}>Delivered ({deliveredPct}%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
              <Text variant="bodySmall" style={styles.legendText}>Pending ({pendingPct}%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#0284c7' }]} />
              <Text variant="bodySmall" style={styles.legendText}>On Route ({outPct}%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
              <Text variant="bodySmall" style={styles.legendText}>Cancelled ({cancelPct}%)</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* 3. PRODUCT DEMAND COMPARISON */}
      <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
            Product Sales Demand 🚰
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 14 }}>
            Sales ratio by water product category
          </Text>

          <View style={styles.productDemandRow}>
            <View style={styles.productProgressItem}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>20L Water Can</Text>
                <Text style={styles.productPct}>{productBreakdown.cans20l}%</Text>
              </View>
              <View style={styles.productTrack}>
                <View style={[styles.productFill, { width: `${productBreakdown.cans20l}%`, backgroundColor: '#0284c7' }]} />
              </View>
            </View>

            <View style={styles.productProgressItem}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>25L Water Can</Text>
                <Text style={styles.productPct}>{productBreakdown.cans25l}%</Text>
              </View>
              <View style={styles.productTrack}>
                <View style={[styles.productFill, { width: `${productBreakdown.cans25l}%`, backgroundColor: '#0891b2' }]} />
              </View>
            </View>

            <View style={styles.productProgressItem}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>Water Tanker Supply</Text>
                <Text style={styles.productPct}>{productBreakdown.tankers}%</Text>
              </View>
              <View style={styles.productTrack}>
                <View style={[styles.productFill, { width: `${productBreakdown.tankers}%`, backgroundColor: '#2563eb' }]} />
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  chartCard: {
    borderRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartTitle: {
    fontWeight: '800',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  growthText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '700',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 20,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValueText: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '600',
  },
  barTrack: {
    width: 14,
    height: 95,
    backgroundColor: '#f1f5f9',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barDayLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
    fontWeight: '500',
  },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 14,
  },
  segment: {
    height: '100%',
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '45%',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#475569',
    fontSize: 12,
  },
  productDemandRow: {
    gap: 12,
  },
  productProgressItem: {
    gap: 4,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  productPct: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284c7',
  },
  productTrack: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  productFill: {
    height: '100%',
    borderRadius: 4,
  },
});
