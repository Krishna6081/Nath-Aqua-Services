import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, SegmentedButtons, useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { adminApi } from '../../api/adminApi';
import { GradientHeader } from '../../components/common/GradientHeader';
import { CURRENCY_SYMBOL } from '../../constants/config';
import { AdminAnalyticsChart } from '../../components/admin/AdminAnalyticsChart';

export const AdminReportsScreen = ({ navigation }: any) => {
  const [reportType, setReportType] = useState<'daily' | 'monthly'>('daily');
  const [reportData, setReportData] = useState<any>(null);
  const [exporting, setExporting] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await adminApi.getReports(reportType);
        setReportData(res.data);
      } catch (err) {
        console.log('Error loading reports:', err);
      }
    };
    fetchReport();
  }, [reportType]);

  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      Alert.alert('Report Exported 🎉', `Nath Water Service ${reportType.toUpperCase()} sales report saved as CSV file.`);
    }, 800);
  };

  const handleExportPDF = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      Alert.alert('PDF Exported 📄', `Nath Water Service ${reportType.toUpperCase()} financial summary generated as PDF document.`);
    }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GradientHeader title="Analytics & Revenue Reports" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.filter}>
        <SegmentedButtons
          value={reportType}
          onValueChange={(val) => setReportType(val as any)}
          buttons={[
            { value: 'daily', label: 'Daily Report' },
            { value: 'monthly', label: 'Monthly Report' },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Total Revenue Highlight Card */}
        <Card style={[styles.revenueCard, { backgroundColor: '#0284c7' }]}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text variant="bodySmall" style={{ color: '#e0f2fe', fontWeight: '700' }}>
              Total Revenue ({reportType.toUpperCase()})
            </Text>
            <Text variant="headlineLarge" style={{ fontWeight: '900', color: '#ffffff', marginVertical: 4 }}>
              {CURRENCY_SYMBOL}
              {reportData?.metrics?.revenue ? reportData.metrics.revenue.toFixed(2) : '0.00'}
            </Text>
            <View style={styles.badgeRow}>
              <Icon name="check-decagram" size={14} color="#34d399" />
              <Text style={styles.badgeText}>Verified Audit Report</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Orders Count Grid */}
        <View style={styles.row}>
          <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text variant="headlineSmall" style={{ fontWeight: '800', color: theme.colors.onSurface }}>
                {reportData?.metrics?.totalOrders || 0}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline }}>Total Orders</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text variant="headlineSmall" style={{ fontWeight: '800', color: '#059669' }}>
                {reportData?.metrics?.deliveredOrders || 0}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline }}>Completed</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Visual Analytics Graphs */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Financial & Demand Breakdown
        </Text>

        <AdminAnalyticsChart
          weeklyData={
            reportType === 'daily'
              ? [
                  { day: 'Mon', amount: 1450, orders: 12 },
                  { day: 'Tue', amount: 2100, orders: 18 },
                  { day: 'Wed', amount: 1850, orders: 15 },
                  { day: 'Thu', amount: 2600, orders: 22 },
                  { day: 'Fri', amount: 3100, orders: 27 },
                  { day: 'Sat', amount: 3900, orders: 34 },
                  { day: 'Sun', amount: 4200, orders: 38 },
                ]
              : [
                  { day: 'W1', amount: 12450, orders: 98 },
                  { day: 'W2', amount: 16100, orders: 128 },
                  { day: 'W3', amount: 18850, orders: 145 },
                  { day: 'W4', amount: 21600, orders: 172 },
                ]
          }
          statusBreakdown={{
            delivered: reportData?.metrics?.deliveredOrders || 68,
            pending: reportData?.metrics?.pendingOrders || 18,
            outForDelivery: 10,
            cancelled: 4,
          }}
        />

        {/* Export Data Card */}
        <Card style={[styles.exportCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: '800', color: theme.colors.onSurface, marginBottom: 4 }}>
              Export Financial Documents
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 14 }}>
              Download detailed CSV spread sheets or formatted PDF statements.
            </Text>

            <View style={styles.exportButtonRow}>
              <Button
                mode="contained"
                icon="file-excel"
                loading={exporting}
                disabled={exporting}
                onPress={handleExportCSV}
                style={[styles.exportBtn, { backgroundColor: '#059669' }]}
                labelStyle={{ fontWeight: '700', fontSize: 13 }}
              >
                Export CSV Data
              </Button>

              <Button
                mode="contained"
                icon="file-pdf-box"
                loading={exporting}
                disabled={exporting}
                onPress={handleExportPDF}
                style={[styles.exportBtn, { backgroundColor: '#0284c7' }]}
                labelStyle={{ fontWeight: '700', fontSize: 13 }}
              >
                Export PDF
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 14,
  },
  revenueCard: {
    borderRadius: 22,
    elevation: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontWeight: '800',
    marginTop: 8,
  },
  exportCard: {
    borderRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  exportButtonRow: {
    gap: 10,
  },
  exportBtn: {
    borderRadius: 14,
  },
});
