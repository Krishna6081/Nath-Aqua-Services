import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, SegmentedButtons, useTheme } from 'react-native-paper';
import { adminApi } from '../../api/adminApi';
import { GradientHeader } from '../../components/common/GradientHeader';
import { CURRENCY_SYMBOL } from '../../constants/config';

export const AdminReportsScreen = ({ navigation }: any) => {
  const [reportType, setReportType] = useState<'daily' | 'monthly'>('daily');
  const [reportData, setReportData] = useState<any>(null);
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

  return (
    <View style={styles.container}>
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

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text variant="bodyMedium" style={{ color: '#64748b' }}>
              Total Revenue ({reportType})
            </Text>
            <Text variant="headlineLarge" style={{ fontWeight: 'bold', color: theme.colors.primary, marginVertical: 8 }}>
              {CURRENCY_SYMBOL}
              {reportData?.metrics?.revenue?.toFixed(2) || '0.00'}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.row}>
          <Card style={styles.statCard}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
                {reportData?.metrics?.totalOrders || 0}
              </Text>
              <Text variant="bodySmall">Total Orders</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: '#15803d' }}>
                {reportData?.metrics?.deliveredOrders || 0}
              </Text>
              <Text variant="bodySmall">Completed</Text>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>
              Export Reports
            </Text>
            <Button mode="contained" icon="file-excel" style={{ borderRadius: 25, marginBottom: 8 }}>
              Export as CSV Data
            </Button>
            <Button mode="outlined" icon="file-pdf-box" style={{ borderRadius: 25 }}>
              Export as PDF Document
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  filter: {
    padding: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 14,
    borderRadius: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
  },
});
