import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { GradientHeader } from '../../components/common/GradientHeader';

export const HelpSupportScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <GradientHeader title="Help & Support" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>📞</Text>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              Customer Support Helpline
            </Text>
            <Text variant="headlineSmall" style={{ color: '#0284c7', fontWeight: 'bold', marginVertical: 8 }}>
              +91 1800-123-9284
            </Text>
            <Text variant="bodySmall" style={{ color: '#64748b' }}>
              Available 7:00 AM to 9:00 PM (Monday - Sunday)
            </Text>
            <Button mode="contained" icon="phone" style={{ borderRadius: 25, marginTop: 14 }}>
              Call Support Now
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>
              Frequently Asked Questions
            </Text>
            <Text style={{ fontWeight: 'bold', marginTop: 6 }}>Q: What is the delivery timing?</Text>
            <Text variant="bodySmall" style={{ color: '#475569' }}>
              We deliver water between 8:00 AM and 7:00 PM in select 2-hour delivery slots.
            </Text>
            <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Q: How do subscriptions work?</Text>
            <Text variant="bodySmall" style={{ color: '#475569' }}>
              Subscriptions automatically create orders for your chosen frequency (daily or weekly).
            </Text>
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
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 14,
    borderRadius: 16,
  },
});
